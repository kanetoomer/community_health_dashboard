#!/usr/bin/env python3
import sys
import io
import json
import base64
import pandas as pd
import matplotlib.pyplot as plt
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader
from PIL import Image

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
            # Standardize date and ZIP code formats if they exist
            if 'date' in df.columns:
                df['date'] = pd.to_datetime(df['date'], errors='coerce').dt.strftime('%Y-%m-%d')
            if 'zip' in df.columns:
                df['zip'] = df['zip'].astype(str).str.zfill(5)

        # (Optional) Apply filters here if needed
        # For this example, we skip filtering.

        # Compute summary statistics
        summary = df.describe().to_dict()

        # Missing values summary (for each column)
        missing_summary = {col: int(df[col].isna().sum()) for col in df.columns}

        # Outliers summary placeholder (implement your outlier detection logic here)
        outliers_summary = {}  # e.g., you might count values beyond 1.5 * IQR

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

        # For this example, we'll use the same plot for the correlation plot.
        # In practice, replace this with your actual correlation plot generation.
        correlation_plot = histogram_plot

        # Generate PDF report using ReportLab
        pdf_report = generate_pdf_report(summary, missing_summary, outliers_summary, histogram_plot, correlation_plot)

        # Return a dictionary with all analysis results and the report (PDF encoded in base64)
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

    # Page 1: Summary Statistics
    text = c.beginText(margin, height - margin)
    text.setFont("Helvetica", 10)
    text.textLine("Data Analysis Report")
    text.textLine("")
    text.textLine("Summary Statistics:")
    summary_str = json.dumps(summary, indent=2)
    for line in summary_str.splitlines():
        text.textLine(line)
    c.drawText(text)
    c.showPage()

    # Page 2: Missing Data Summary
    text = c.beginText(margin, height - margin)
    text.setFont("Helvetica", 10)
    text.textLine("Missing Data Summary:")
    missing_str = json.dumps(missing_summary, indent=2)
    for line in missing_str.splitlines():
        text.textLine(line)
    c.drawText(text)
    c.showPage()

    # Page 3: Outliers Summary
    text = c.beginText(margin, height - margin)
    text.setFont("Helvetica", 10)
    text.textLine("Outliers Summary:")
    outliers_str = json.dumps(outliers_summary, indent=2)
    for line in outliers_str.splitlines():
        text.textLine(line)
    c.drawText(text)
    c.showPage()

    # Page 4: Histogram Plot
    if histogram_plot:
        histogram_data = base64.b64decode(histogram_plot)
        histogram_image = Image.open(io.BytesIO(histogram_data))
        histogram_reader = ImageReader(histogram_image)
        c.drawImage(histogram_reader, margin, margin, width=width - 2 * margin, preserveAspectRatio=True, mask='auto')
        c.showPage()

    # Page 5: Correlation Plot
    if correlation_plot:
        correlation_data = base64.b64decode(correlation_plot)
        correlation_image = Image.open(io.BytesIO(correlation_data))
        correlation_reader = ImageReader(correlation_image)
        c.drawImage(correlation_reader, margin, margin, width=width - 2 * margin, preserveAspectRatio=True, mask='auto')
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
