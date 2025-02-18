#!/usr/bin/env python3
import sys
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns  # For enhanced heatmap visualization
import json
import io
import base64
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader

def analyze_and_plot(file_path, cleaning_options={}, filters={}):
    try:
        # Read CSV data
        df = pd.read_csv(file_path)
        
        # Data Cleaning Options
        if cleaning_options.get("removeDuplicates", False):
            df = df.drop_duplicates()
        
        if cleaning_options.get("handleMissing", False):
            # Fill missing values using forward fill as an example
            df = df.fillna(method='ffill')
        
        if cleaning_options.get("standardizeFormats", False):
            # Standardize dates if a 'date' column exists
            if 'date' in df.columns:
                df['date'] = pd.to_datetime(df['date'], errors='coerce').dt.strftime('%Y-%m-%d')
            # Standardize ZIP codes if a 'zip' column exists (pad with zeros to 5 digits)
            if 'zip' in df.columns:
                df['zip'] = df['zip'].astype(str).str.zfill(5)
        
        # Missing Data Analysis: count missing values per column
        missing_summary = df.isnull().sum().to_dict()
        
        # Apply Filters
        if filters.get("date", "") and "date" in df.columns:
            df = df[df['date'] == filters["date"]]
        
        if filters.get("location", "") and "location" in df.columns:
            df = df[df['location'].astype(str).str.contains(filters["location"], case=False, na=False)]
        
        # Compute summary statistics
        summary = df.describe().to_dict()
        
        # Outlier Detection using IQR for each numeric column
        outliers_summary = {}
        numeric_cols = df.select_dtypes(include='number').columns
        for col in numeric_cols:
            Q1 = df[col].quantile(0.25)
            Q3 = df[col].quantile(0.75)
            IQR = Q3 - Q1
            outlier_count = df[(df[col] < (Q1 - 1.5 * IQR)) | (df[col] > (Q3 + 1.5 * IQR))].shape[0]
            outliers_summary[col] = int(outlier_count)
        
        if len(numeric_cols) == 0:
            return {"error": "No numeric columns found in CSV after cleaning/filtering."}
        
        # Generate a histogram for the first numeric column
        col = numeric_cols[0]
        plt.figure(figsize=(6,4))
        df[col].hist(bins=30)
        plt.title(f'Histogram of {col}')
        plt.xlabel(col)
        plt.ylabel('Frequency')
        buf1 = io.BytesIO()
        plt.savefig(buf1, format='png')
        plt.close()
        buf1.seek(0)
        hist_base64 = base64.b64encode(buf1.getvalue()).decode('utf-8')
        
        # Generate a correlation heatmap for numeric columns
        plt.figure(figsize=(8,6))
        corr_matrix = df[numeric_cols].corr()
        sns.heatmap(corr_matrix, annot=True, cmap='coolwarm', fmt=".2f")
        plt.title("Correlation Matrix")
        buf2 = io.BytesIO()
        plt.savefig(buf2, format='png')
        plt.close()
        buf2.seek(0)
        corr_base64 = base64.b64encode(buf2.getvalue()).decode('utf-8')
        
        # -----------------------------
        # Generate PDF Report using ReportLab
        pdf_buffer = io.BytesIO()
        c = canvas.Canvas(pdf_buffer, pagesize=letter)
        width, height = letter

        # Title
        c.setFont("Helvetica-Bold", 16)
        c.drawString(50, height - 50, "Data Analysis Report")

        # Summary Statistics Section
        c.setFont("Helvetica-Bold", 12)
        c.drawString(50, height - 80, "Summary Statistics:")
        c.setFont("Helvetica", 8)
        text_obj = c.beginText(50, height - 100)
        for line in json.dumps(summary, indent=2).splitlines():
            text_obj.textLine(line)
        c.drawText(text_obj)

        # Missing Data Summary
        c.setFont("Helvetica-Bold", 12)
        c.drawString(50, height - 250, "Missing Data Summary:")
        c.setFont("Helvetica", 8)
        text_obj = c.beginText(50, height - 270)
        for line in json.dumps(missing_summary, indent=2).splitlines():
            text_obj.textLine(line)
        c.drawText(text_obj)

        # Outliers Summary
        c.setFont("Helvetica-Bold", 12)
        c.drawString(300, height - 250, "Outliers Summary:")
        c.setFont("Helvetica", 8)
        text_obj = c.beginText(300, height - 270)
        for line in json.dumps(outliers_summary, indent=2).splitlines():
            text_obj.textLine(line)
        c.drawText(text_obj)

        # Add Histogram Image
        img1 = ImageReader(buf1)
        c.drawImage(img1, 50, height - 500, width=200, preserveAspectRatio=True, mask='auto')

        # Add Correlation Heatmap Image
        img2 = ImageReader(buf2)
        c.drawImage(img2, 300, height - 500, width=200, preserveAspectRatio=True, mask='auto')

        c.showPage()
        c.save()
        pdf_buffer.seek(0)
        pdf_base64 = base64.b64encode(pdf_buffer.getvalue()).decode('utf-8')
        # -----------------------------

        # Return results
        return {
            "summary": summary,
            "missingSummary": missing_summary,
            "outliersSummary": outliers_summary,
            "histogramPlot": hist_base64,
            "correlationPlot": corr_base64,
            "pdfReport": pdf_base64,
            "message": "Analysis and plots generated successfully"
        }
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No CSV file path provided"}))
        sys.exit(1)
    
    file_path = sys.argv[1]
    cleaning_options = {}
    if len(sys.argv) >= 3:
        try:
            cleaning_options = json.loads(sys.argv[2])
        except Exception as e:
            cleaning_options = {}
    
    filters = {}
    if len(sys.argv) >= 4:
        try:
            filters = json.loads(sys.argv[3])
        except Exception as e:
            filters = {}
    
    result = analyze_and_plot(file_path, cleaning_options, filters)
    print(json.dumps(result))
