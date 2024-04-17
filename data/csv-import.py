import pandas as pd

df = pd.read_csv('verleih.csv', encoding='ISO-8859-1', skip_blank_lines=True).dropna(how="all")
df['jahr'] = df['jahr'].fillna(-1).astype(int)


df.to_csv('cleaned.csv', index=False, encoding='utf-8', columns=['KatalogNr', 'Regie', 'Titel', 'Originaltitel', 'jahr'])
