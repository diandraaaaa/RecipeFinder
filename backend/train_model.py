# 📁 backend/train_model.py
import pandas as pd
import torch
import torch.nn as nn
import torch.optim as optim
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import MultiLabelBinarizer
from torch.utils.data import DataLoader, Dataset
from tqdm import tqdm
import ast

# Load and clean data
df = pd.read_csv("data/cleaned_recipes.csv")
df["ingredients"] = df["ingredients"].apply(ast.literal_eval)

# Encode ingredients
mlb = MultiLabelBinarizer()
ing_matrix = mlb.fit_transform(df["ingredients"])

# Split data
X_train, X_test = train_test_split(ing_matrix, test_size=0.2, random_state=42)

# Convert to PyTorch tensors
X_train = torch.tensor(X_train).float()
X_test = torch.tensor(X_test).float()

class IngredientDataset(Dataset):
    def __init__(self, data):
        self.data = data

    def __len__(self):
        return len(self.data)

    def __getitem__(self, idx):
        x = self.data[idx]
        return x, x

train_loader = DataLoader(IngredientDataset(X_train), batch_size=32, shuffle=True)
test_loader = DataLoader(IngredientDataset(X_test), batch_size=32)

# Define model
class IngredientPredictor(nn.Module):
    def __init__(self, input_size, hidden_size=128):
        super().__init__()
        self.encoder = nn.Sequential(nn.Linear(input_size, hidden_size), nn.ReLU())
        self.decoder = nn.Sequential(nn.Linear(hidden_size, input_size), nn.Sigmoid())

    def forward(self, x):
        return self.decoder(self.encoder(x))

model = IngredientPredictor(input_size=X_train.shape[1])
criterion = nn.BCELoss()
optimizer = optim.Adam(model.parameters(), lr=0.001)

# Train model
for epoch in range(10):
    model.train()
    total_loss = 0
    progress_bar = tqdm(train_loader, desc=f"Epoch {epoch+1}/10")
    for x, y in progress_bar:
        optimizer.zero_grad()
        output = model(x)
        loss = criterion(output, y)
        loss.backward()
        optimizer.step()
        total_loss += loss.item()
        progress_bar.set_postfix(loss=total_loss / len(train_loader))

# Save model and classes
torch.save(model.state_dict(), "model/model.pth")
import joblib
joblib.dump(mlb, "model/mlb.pkl")
print("✅ Model and label binarizer saved.")
