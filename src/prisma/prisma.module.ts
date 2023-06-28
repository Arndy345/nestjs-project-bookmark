import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';


//This exports the modules in the export array globally and you'd need to import it just once in the main app module
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
