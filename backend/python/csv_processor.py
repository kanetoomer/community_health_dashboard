#!/usr/bin/env python3
import sys
import io
import os
import json
import base64
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from reportlab.platypus import Table, TableStyle
from reportlab.lib.utils import ImageReader
from PIL import Image

def analyze_and_plot(file_path, cleaning_options={}, filters={}):
    try:
        # Detect file extension
        _, ext = os.path.splitext(file_path)

        # Load the dataset based on file extension
        if ext == '.csv':
            df = pd.read_csv(file_path)
        elif ext == '.data':
            # Attempt to read .data file (assuming space or comma separated, no header)
            try:
                df = pd.read_csv(file_path, header=None, delimiter=r'\s+')
            except Exception:
                df = pd.read_csv(file_path, header=None, delimiter=',')
            # Optional: Assign generic column names
            df.columns = [f"col_{i}" for i in range(df.shape[1])]
        else:
            return {"error": f"Unsupported file type: {ext}"}

        # Data Cleaning Options
        if cleaning_options.get("removeDuplicates", False):
            df = df.drop_duplicates()

        if cleaning_options.get("handleMissing", False):
            # Fill missing values using forward fill as an example
            df = df.fillna(method='ffill')

        if cleaning_options.get("standardizeFormats", False):
            # Standardize date and ZIP code formats if they exist
            if 'date' in df.columns:
                df['date'] = pd.to_datetime(df['date'], errors='coerce').dt.strftime('%Y-%m-%d')
            if 'zip' in df.columns:
                df['zip'] = df['zip'].astype(str).str.zfill(5)

        # Compute summary statistics
        summary = df.describe().to_dict()

        # Missing values summary (for each column)
        missing_summary = {col: int(df[col].isna().sum()) for col in df.columns}

        # Outliers summary 
        outliers_summary = {}
        for col in numeric_cols:
            Q1 = df[col].quantile(0.25)
            Q3 = df[col].quantile(0.75)
            IQR = Q3 - Q1
            lower_bound = Q1 - 1.5 * IQR
            upper_bound = Q3 + 1.5 * IQR
            outliers = df[(df[col] < lower_bound) | (df[col] > upper_bound)]
            outliers_summary[col] = {
                "count": int(outliers.shape[0]),
                "lower_bound": round(lower_bound, 2),
                "upper_bound": round(upper_bound, 2)
            }

        # Generate a histogram for the first numeric column
        numeric_cols = df.select_dtypes(include='number').columns
        if len(numeric_cols) == 0:
            return {"error": "No numeric columns found in CSV after cleaning/filtering."}
        col = numeric_cols[0]
        plt.figure()
        df[col].hist(bins=30)
        plt.title(f'Histogram of {col}')
        plt.xlabel(col)
        plt.ylabel('Frequency')
        buf = io.BytesIO()
        plt.savefig(buf, format='png')
        plt.close()
        buf.seek(0)
        histogram_plot = base64.b64encode(buf.getvalue()).decode('utf-8')

        # Generate a correlation plot (heatmap) even if there's only one numeric column
        plt.figure(figsize=(8, 6))
        corr = df[numeric_cols].corr()
        sns.heatmap(corr, annot=True, cmap='coolwarm')
        plt.title("Correlation Matrix")
        buf2 = io.BytesIO()
        plt.savefig(buf2, format='png')
        plt.close()
        buf2.seek(0)
        correlation_plot = base64.b64encode(buf2.getvalue()).decode('utf-8')

        # Generate PDF report using ReportLab (each page has distinct content)
        pdf_report = generate_pdf_report(summary, missing_summary, outliers_summary, histogram_plot, correlation_plot)

        # Return all analysis results along with the PDF report (PDF encoded in base64)
        return {
            "summary": summary,
            "missingSummary": missing_summary,
            "outliersSummary": outliers_summary,
            "histogramPlot": histogram_plot,
            "correlationPlot": correlation_plot,
            "pdfReport": base64.b64encode(pdf_report).decode("utf-8"),
            "message": "Analysis and plots generated successfully"
        }
    except Exception as e:
        return {"error": str(e)}

def generate_pdf_report(summary, missing_summary, outliers_summary, histogram_plot, correlation_plot):
    buffer = io.BytesIO()
    c = canvas.Canvas(buffer, pagesize=letter)
    width, height = letter
    margin = 40
    line_height = 14

    def draw_page_number():
        c.setFont("Helvetica", 8)
        c.drawRightString(width - margin, 10, f"Page {c.getPageNumber()}")

    # Page 1: Summary Statistics (by column)
    c.setFont("Helvetica-Bold", 14)
    c.drawString(margin, height - margin, "Data Analysis Report")
    c.setFont("Helvetica", 10)
    y = height - margin - 2 * line_height
    c.drawString(margin, y, "Summary Statistics by Column:")
    y -= line_height * 2

    for col, stats in summary.items():
        if y < 100:
            draw_page_number()
            c.showPage()
            y = height - margin

        c.setFont("Helvetica-Bold", 11)
        c.drawString(margin, y, f"Column: {col}")
        y -= line_height
        c.setFont("Helvetica", 10)
        for stat, value in stats.items():
            c.drawString(margin + 20, y, f"{stat}: {value}")
            y -= line_height
        y -= line_height

    draw_page_number()
    c.showPage()

    # Page 2: Missing Data Summary
    c.setFont("Helvetica-Bold", 12)
    c.drawString(margin, height - margin, "Missing Data Summary")

    data = [["Column", "Missing Values"]]
    for col, count in missing_summary.items():
        data.append([col, str(count)])

    table = Table(data, colWidths=[250, 150])
    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.black),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
    ]))
    table.wrapOn(c, width, height)
    table.drawOn(c, margin, height - 200)

    draw_page_number()
    c.showPage()

    # Page 3: Outliers Summary
    c.setFont("Helvetica-Bold", 12)
    c.drawString(margin, height - margin, "Outliers Summary")

    data = [["Column", "Outlier Count", "Lower Bound", "Upper Bound"]]
    for col, details in outliers_summary.items():
        data.append([
            col,
            str(details.get("count", "")),
            str(details.get("lower_bound", "")),
            str(details.get("upper_bound", ""))
        ])

    table = Table(data, colWidths=[150, 100, 130, 130])
    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.lightblue),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.black),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
    ]))
    table.wrapOn(c, width, height)
    table.drawOn(c, margin, height - 240)

    draw_page_number()
    c.showPage()

    # Page 4: Histogram Plot
    if histogram_plot:
        c.setFont("Helvetica-Bold", 12)
        c.drawString(margin, height - margin, "Histogram Plot")
        histogram_data = base64.b64decode(histogram_plot)
        histogram_image = Image.open(io.BytesIO(histogram_data))
        histogram_reader = ImageReader(histogram_image)
        c.drawImage(histogram_reader, margin, margin, width=width - 2 * margin, preserveAspectRatio=True, mask='auto')
        draw_page_number()
        c.showPage()

    # Page 5: Correlation Plot
    if correlation_plot:
        c.setFont("Helvetica-Bold", 12)
        c.drawString(margin, height - margin, "Correlation Matrix")
        correlation_data = base64.b64decode(correlation_plot)
        correlation_image = Image.open(io.BytesIO(correlation_data))
        correlation_reader = ImageReader(correlation_image)
        c.drawImage(correlation_reader, margin, margin, width=width - 2 * margin, preserveAspectRatio=True, mask='auto')
        draw_page_number()
        c.showPage()

    c.save()
    pdf = buffer.getvalue()
    buffer.close()
    return pdf

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No CSV file path provided"}))
        sys.exit(1)
    
    file_path = sys.argv[1]
    cleaning_options = {}
    filters = {}
    result = analyze_and_plot(file_path, cleaning_options, filters)
    print(json.dumps(result))
