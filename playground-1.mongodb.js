// Select the database to use.
// If it doesn't exist, it will be created when you first insert data.
use('vibeflow_db'); // Or your preferred database name

// Define the document to insert
const googleTrendsRisingTermsDoc = {
  "name": "Google Trends - Daily Top Rising Terms (US)",
  "description": "Provides daily top *rising* search terms in the United States from Google Trends. Includes data points like the search term, score, rank, percentage gain, week, refresh date, and designated market area (DMA ID and name). This dataset is useful for identifying rapidly growing search interests and can be leveraged for timely content creation, marketing insights, and understanding emerging trends. Data is anonymized, aggregated, indexed, and accessed via BigQuery.",
  "source_url": "https://console.cloud.google.com/bigquery?p=bigquery-public-data&d=google_trends&t=top_rising_terms&page=table",
  "original_source_name": "Google Cloud Public Datasets / Google Trends",
  "categories": ["Internet", "Search Data", "Trends", "Analytics", "Marketing", "Rising Terms", "Real-time Insights", "United States"],
  "keywords": ["google trends", "top rising terms", "breakout terms", "search terms", "trending topics", "bigquery", "public data", "seo", "keyword research", "united states", "daily trends", "dma", "percent gain"],
  "data_format": ["BigQuery Table"],
  "update_frequency": "Daily",
  "license": "Custom (Google Cloud Terms)",
  "sample_data_snippet": {
      "dma_name": "New York",
      "dma_id": 501,
      "term": "New Summer Blockbuster Movie",
      "week": new Date("2025-06-08"),
      "score": 12500,
      "rank": 1,
      "percent_gain": 350,
      "refresh_date": new Date("2025-06-13")
  },
  "potential_use_cases": [
    "Identifying breakout search queries for rapid response content.",
    "Tracking emerging trends within specific US designated market areas.",
    "Powering applications that display 'hot topics' or 'trending now' sections.",
    "Early detection of shifts in consumer interest or news cycles based on search term velocity."
  ],
  "description_embedding": [], // Placeholder for actual vector embedding
  "date_added_to_vibeflow": new Date(),
  "last_verified_by_vibeflow": new Date(),
  "notes_for_vibeflow_admin": "Table ID: bigquery-public-data.google_trends.top_rising_terms. Located in US. Partitioned by DAY on refresh_date. Last modified (source): Jun 12, 2025, 7:00:11 PM UTC-7. Total logical bytes (source): 3.16 GB. Contains 43,974,000 rows."
};

// Insert the document into the 'datasets' collection
// If the collection doesn't exist, it will be created.
db.datasets.insertOne(googleTrendsRisingTermsDoc);

// Optional: Verify the insertion by finding the document
db.datasets.findOne({ "name": "Google Trends - Daily Top Rising Terms (US)" });
