import { Migration } from '@mikro-orm/migrations';

export class Migration20250329012447 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "product_review" add column if not exists "recommend" boolean not null default true;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "product_review" drop column if exists "recommend";`);
  }

}
