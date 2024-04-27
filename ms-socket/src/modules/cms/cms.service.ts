import axios, { AxiosError, AxiosResponse } from 'axios';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {CMS_API_ENDPOINTS} from 'src/constants/cms';
import { Question } from 'src/models/question';



@Injectable()
export class CmsService {
    baseUrl: string;

    constructor(
        private readonly configService: ConfigService,
        private readonly httpService: HttpService
    ) {
        this.baseUrl = this.configService.get<string>('cms.apiBaseUrl');
    }

    async getGameQuestions(gameId: string): Promise<Question[]> {
        if(!gameId) {
            throw new Error("Game ID is required to get questions");
        }
        const url = `https://yonoapp.com/cms/api/games/${gameId}?populate=*`;
        
        try {
            const reponse = await axios.get(url);
            const questions = reponse.data.data.attributes.questionList;
            
            questions.forEach((question: any, index: number) => {
                question.id = index;
                question.text = question.Question;
            })

            return questions
        } catch (error) {
            console.error(error);
            return error;
        }
      }

    async getCategories() {
        // Strapi'den categories'leri almak için API çağrısı yapılır.
        const response = await this.httpService.get(`${this.baseUrl}/${CMS_API_ENDPOINTS.categories}`).toPromise();
        return response.data;
    }
}
