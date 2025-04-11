export class CreateSessionDto {
  topic: string;
  duration: number;
  date: string; // ISO string
  notes?: string;
}
