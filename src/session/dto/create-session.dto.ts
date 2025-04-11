import { ApiProperty } from '@nestjs/swagger';

export class CreateSessionDto {
  @ApiProperty({ example: 'Math', description: 'The topic of the session' })
  topic: string;

  @ApiProperty({ example: 60, description: 'Duration of the session in minutes' })
  duration: number;

  @ApiProperty({ example: '2023-10-01', description: 'Date of the session in YYYY-MM-DD format' })
  date: string;

  @ApiProperty({ example: 'Reviewed algebra', description: 'Optional notes for the session', required: false })
  notes?: string;
}