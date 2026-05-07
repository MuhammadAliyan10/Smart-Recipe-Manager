// src/api/scanner.ts
import client from './client';

export interface ScannedIngredient {
  name: string;
  quantity: string;
  category: string;
  confidence_score: number;
}

export interface ExtractionResponse {
  saved_items: ScannedIngredient[]; // Updated to match FastAPI PersistenceResponse
  unrecognized_text: string;
}

/**
 * Uploads a receipt image to the AI extraction endpoint.
 * Uses multipart/form-data for image transmission.
 */
export const uploadReceipt = async (imageUri: string): Promise<ExtractionResponse> => {
  const formData = new FormData();
  
  // Prepare the file object for React Native FormData
  const fileName = imageUri.split('/').pop() || 'receipt.jpg';
  const fileData = {
    uri: imageUri,
    name: fileName,
    type: 'image/jpeg',
  } as any;

  formData.append('file', fileData);

  try {
    const response = await client.post<ExtractionResponse>('/v1/extract', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      // Important for large image uploads
      transformRequest: (data) => data, 
    });
    return response.data;
  } catch (error) {
    console.error("[API] Receipt upload failed:", error);
    throw error;
  }
};
