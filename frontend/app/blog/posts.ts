export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  // content: array of paragraphs / headings
  content: { type: "heading" | "paragraph"; text: string }[];
};

export const posts: BlogPost[] = [
  {
    slug: "what-is-automl",
    title: "What is AutoML, and why does it matter?",
    excerpt:
      "Machine learning is powerful — but building models has always required deep expertise. AutoML changes that. Here's how Algotrix takes you from a raw CSV to a trained model without writing a single line of code.",
    date: "June 2026",
    readTime: "6 min read",
    category: "Machine Learning",
    content: [
      {
        type: "paragraph",
        text: "For most of its history, machine learning has been locked behind a wall of expertise. To build even a simple predictive model, you needed to understand data cleaning, feature engineering, algorithm selection, cross-validation, and hyperparameter tuning — and you needed to write a lot of code to glue it all together. AutoML, short for Automated Machine Learning, exists to tear down that wall.",
      },
      {
        type: "heading",
        text: "The problem with traditional ML",
      },
      {
        type: "paragraph",
        text: "Imagine you have a spreadsheet of customer data and you simply want to predict which customers are likely to churn. In a traditional workflow, you would spend hours loading the data, checking for missing values, deciding how to encode categorical columns, scaling numeric features, splitting the data, trying several algorithms, comparing them fairly, and finally tuning the best one. Each of these steps has dozens of decisions, and a wrong choice anywhere can quietly ruin your results.",
      },
      {
        type: "paragraph",
        text: "This complexity means that the people who understand the business problem best — analysts, founders, domain experts — are often unable to build models themselves. They have to wait for a data scientist, which is slow and expensive.",
      },
      {
        type: "heading",
        text: "What AutoML automates",
      },
      {
        type: "paragraph",
        text: "AutoML automates the repetitive, error-prone parts of the pipeline. A good AutoML system will profile your data, clean it intelligently, choose whether your problem is classification or regression, train and compare multiple models using proper cross-validation, tune the best one, and report honest performance metrics. The result is a workflow that takes minutes instead of days, with fewer mistakes.",
      },
      {
        type: "heading",
        text: "How Algotrix does it",
      },
      {
        type: "paragraph",
        text: "Algotrix is built around a simple promise: upload a CSV, get a trained model. When you upload a dataset, Algotrix immediately profiles every column, detecting data types, missing values, and duplicates. It then cleans the data — removing duplicates, filling or dropping missing values, encoding categories, and scaling features — all while being careful not to leak information from the target column.",
      },
      {
        type: "paragraph",
        text: "Next, Algotrix analyzes your columns and recommends the best target to predict, complete with a confidence score and a plain-English reason. Once you confirm the target, it automatically detects whether the task is classification or regression, trains three different models with cross-validation, and selects the strongest performer. That winning model is then fine-tuned with grid search to squeeze out extra performance.",
      },
      {
        type: "heading",
        text: "Honest metrics, not hype",
      },
      {
        type: "paragraph",
        text: "One of the most important things an AutoML tool can do is report results honestly. Algotrix shows cross-validated scores rather than inflated training-set numbers, so the performance you see reflects how the model is likely to behave on new data. For classification you get accuracy, precision, recall, and F1; for regression you get MAE, MSE, RMSE, and R². You also get visual EDA — histograms and correlation heatmaps — so you actually understand your data.",
      },
      {
        type: "heading",
        text: "The takeaway",
      },
      {
        type: "paragraph",
        text: "AutoML matters because it democratizes machine learning. It lets anyone with a dataset and a question build a real, trustworthy model — without a data science degree. With Algotrix, the entire pipeline from raw data to a downloadable model fits into a few clicks. The future of ML isn't just smarter models; it's making those models accessible to everyone.",
      },
    ],
  },
];
