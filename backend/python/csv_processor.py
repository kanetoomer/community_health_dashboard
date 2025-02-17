#!/usr/bin/env python3
import sys
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import json
import io
import base64

def analyze_and_plot(file_path):
    try:
        # Read CSV data
        df = pd.read_csv(file_path)
        
        # Compute summary statistics using Pandas
        summary = df.describe().to_dict()
        
        # Select numeric columns for plotting
        numeric_cols = df.select_dtypes(include='number').columns
        if len(numeric_cols) == 0:
            return {"error": "No numeric columns found in CSV."}
        
        # Generate a histogram for the first numeric column
        col = numeric_cols[0]
        plt.figure()
        df[col].hist(bins=30)
        plt.title(f'Histogram of {col}')
        plt.xlabel(col)
        plt.ylabel('Frequency')
        
        # Save the plot to an in-memory buffer
        buf = io.BytesIO()
        plt.savefig(buf, format='png')
        plt.close()
        buf.seek(0)
        
        # Encode the image in base64
        image_base64 = base64.b64encode(buf.getvalue()).decode('utf-8')
        
        # Return both the summary and the base64 image string
        return {
            "summary": summary,
            "plot": image_base64,
            "message": "Analysis and plot generated successfully"
        }
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No CSV file path provided"}))
        sys.exit(1)
    
    file_path = sys.argv[1]
    result = analyze_and_plot(file_path)
    print(json.dumps(result))