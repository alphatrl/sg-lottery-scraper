export interface FirebaseTopic {
  topic: string;
  title: string;
  body: string;
}

export interface ScraperTopics {
  silent: boolean;
  topics: FirebaseTopic[];
}
