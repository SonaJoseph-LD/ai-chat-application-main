import axios from 'axios';
import FormData from 'form-data';
import { config } from '../config/env';

export class AiClient {
  private get baseUrl(): string {
    return config.aiService.url;
  }

  public async sendMessage(userId: string, message: string): Promise<string> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/chat`,
        {
          user_id: userId,
          message: message,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 60000,
        }
      );

      if (response.data && typeof response.data === 'object') {
        return response.data.response || JSON.stringify(response.data);
      }
      return String(response.data);
    } catch (error: any) {
      console.error('[AI Client] Error sending message to AI service:', error?.message || error);
      const detail = error.response?.data?.detail || error.message;
      return `Error from AI Service: ${detail}`;
    }
  }

  public async uploadFile(
    userId: string,
    fileBuffer: Buffer,
    fileName: string,
    contentType?: string
  ): Promise<any> {
    try {
      const formData = new FormData();
      formData.append('user_id', userId);
      formData.append('file', fileBuffer, {
        filename: fileName,
        contentType: contentType || 'application/octet-stream',
      });

      const response = await axios.post(`${this.baseUrl}/upload`, formData, {
        headers: {
          ...formData.getHeaders(),
        },
        timeout: 60000,
      });

      return response.data;
    } catch (error: any) {
      console.error('[AI Client] Error uploading file to AI service:', error?.message || error);
      const detail = error.response?.data?.detail || error.message;
      throw new Error(`Error uploading file to AI Service: ${detail}`);
    }
  }
}

export const aiClient = new AiClient();
