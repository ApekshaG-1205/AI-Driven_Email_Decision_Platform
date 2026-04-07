import pandas as pd
import numpy as np

data = pd.read_csv("email_intelligence_dataset.csv")

dup_counts = data.groupby("text").size().sort_values(ascending=False)
print(dup_counts.head(10))

print("Original shape of dataset:", data.shape)

# Remove duplicate rows
clean_data = data.drop_duplicates()

print("After deduplication:", clean_data.shape)

print("Before shuffle:")
print(data.head())

# Shuffle all rows
df_shuffled = data.sample(frac=1, random_state=42).reset_index(drop=True)  # frac shuffles all rows and random_state ensures reproducibility

# save processed data
df_shuffled.to_csv("processed_data.csv", index=False)

# Load the processed dataset again
processed_data = pd.read_csv("processed_data.csv")

print("After shuffle:")
print(processed_data.head(25))
