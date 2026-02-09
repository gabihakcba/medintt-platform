export interface Member {
  project: {
    code: string;
    id: string;
  };
  role: string;
  organization?: {
    id: string;
    name: string;
    code: string;
  };
}
