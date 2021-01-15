import { DynamicModule, Module } from '@nestjs/common';
import { GooglePubSubModule } from '../../lib';

@Module({})
export class PubSubModule {
  static async forRoot(): Promise<DynamicModule> {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return {
      module: PubSubModule,
      imports: [
        GooglePubSubModule.forRoot({}),
        GooglePubSubModule.forRoot({ projectName: 'project2' }),
      ],
    };
  }
}
