const data = [
  { id: 1, published_at: "2024-12-05T14:30:45Z" },
  { id: 2, published_at: "2024-12-05T09:15:30Z" },
  { id: 5, published_at: "2024-02-05T09:15:30Z" },
  { id: 6, published_at: "2025-02-05T09:15:30Z" },
  { id: 3, published_at: "2024-12-04T16:45:00Z" },
  { id: 4, published_at: "2024-12-05T14:35:00Z" }
];

// Sort the data array by the `published_at` field (ISO 8601 string format)
data.sort((a, b) => {
  return new Date(a.published_at) - new Date(b.published_at);
});

// Log the sorted data
console.log(data);

