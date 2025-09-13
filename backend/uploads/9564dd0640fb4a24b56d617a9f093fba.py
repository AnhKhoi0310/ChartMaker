import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

data = pd.read_csv('/app/uploads/9564dd0640fb4a24b56d617a9f093fba')
plt.figure(figsize=(10, 6))
sns.histplot(data['Observed Length (m)'], bins=30, kde=True)
plt.title('Distribution of Observed Length (m)')
plt.xlabel('Observed Length (m)')
plt.ylabel('Frequency')
plt.show()