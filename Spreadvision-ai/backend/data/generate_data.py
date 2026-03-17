import pandas as pd
import numpy as np

np.random.seed(42)

rows = 500

data = {
    "rainfall": np.random.randint(0, 200, rows),
    "temperature": np.random.randint(20, 40, rows),
    "humidity": np.random.randint(40, 100, rows),
    "stagnant_water": np.random.uniform(0, 1, rows)
}

df = pd.DataFrame(data)

# Create risk logic
def assign_risk(row):
    if row["rainfall"] > 100 and row["humidity"] > 70 and row["stagnant_water"] > 0.6:
        return 2  # HIGH
    elif row["rainfall"] > 50:
        return 1  # MEDIUM
    else:
        return 0  # LOW

df["risk"] = df.apply(assign_risk, axis=1)

df.to_csv("disease_weather_dataset.csv", index=False)

print("Dataset created successfully")