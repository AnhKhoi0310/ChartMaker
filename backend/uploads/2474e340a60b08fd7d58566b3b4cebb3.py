import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

data = pd.read_csv('/app/uploads/2474e340a60b08fd7d58566b3b4cebb3')
plt.figure(figsize=(10, 6))
sns.histplot(data['Observed Length (m)'], bins=30, kde=True)
plt.title('Distribution of Observed Length (m)')
plt.xlabel('Observed Length (m)')
plt.ylabel('Frequency')
plt.show()