import { Migration } from '@mikro-orm/migrations';

export class Migration20250329011516 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "product_review_image" drop constraint if exists "product_review_image_product_review_id_foreign";`);

    this.addSql(`alter table if exists "product_review_image" add constraint "product_review_image_product_review_id_foreign" foreign key ("product_review_id") references "product_review" ("id") on update cascade on delete cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "product_review_image" drop constraint if exists "product_review_image_product_review_id_foreign";`);

    this.addSql(`alter table if exists "product_review_image" add constraint "product_review_image_product_review_id_foreign" foreign key ("product_review_id") references "product_review" ("id") on update cascade;`);
  }

}
