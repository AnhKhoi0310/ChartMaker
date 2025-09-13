import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

data = pd.read_csv(r'C:\Users\Admin\OneDrive\Desktop\ChartMaker\backend\uploads\6f24aa2c5359aa0b20e7cb9fd8b6f3f8')
plt.figure(figsize=(12, 8))
sns.countplot(data=data, x='Common Name', hue='Family')
plt.xticks(rotation=90)
plt.tight_layout()
plt.savefig(r'C:\Users\Admin\OneDrive\Desktop\ChartMaker\backend\uploads\6f24aa2c5359aa0b20e7cb9fd8b6f3f8_chart.png')