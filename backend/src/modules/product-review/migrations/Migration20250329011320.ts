import { Migration } from '@mikro-orm/migrations';

export class Migration20250329011320 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "product_review_image" drop constraint if exists "product_review_image_file_id_unique";`);
    this.addSql(`create table if not exists "product_review" ("id" text not null, "title" text null, "content" text not null, "rating" real not null, "first_name" text not null, "last_name" text not null, "status" text check ("status" in ('pending', 'approved', 'rejected')) not null default 'pending', "product_id" text not null, "customer_id" text null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "product_review_pkey" primary key ("id"), constraint rating_range check (rating >= 1 AND rating <= 5));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_REVIEW_PRODUCT_ID" ON "product_review" (product_id) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_product_review_deleted_at" ON "product_review" (deleted_at) WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "product_review_image" ("id" text not null, "file_id" text not null, "name" text not null, "size" integer not null, "mime_type" text not null, "url" text not null, "product_review_id" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "product_review_image_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_product_review_image_file_id_unique" ON "product_review_image" (file_id) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_product_review_image_product_review_id" ON "product_review_image" (product_review_id) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_product_review_image_deleted_at" ON "product_review_image" (deleted_at) WHERE deleted_at IS NULL;`);

    this.addSql(`alter table if exists "product_review_image" add constraint "product_review_image_product_review_id_foreign" foreign key ("product_review_id") references "product_review" ("id") on update cascade;`);

    this.addSql(`drop table if exists "review" cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "product_review_image" drop constraint if exists "product_review_image_product_review_id_foreign";`);

    this.addSql(`create table if not exists "review" ("id" text not null, "title" text null, "content" text not null, "rating" real not null, "first_name" text not null, "last_name" text not null, "status" text check ("status" in ('pending', 'approved', 'rejected')) not null default 'pending', "product_id" text not null, "customer_id" text null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "review_pkey" primary key ("id"), constraint rating_range check (rating >= 1 AND rating <= 5));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_REVIEW_PRODUCT_ID" ON "review" (product_id) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_review_deleted_at" ON "review" (deleted_at) WHERE deleted_at IS NULL;`);

    this.addSql(`drop table if exists "product_review" cascade;`);

    this.addSql(`drop table if exists "product_review_image" cascade;`);
  }

}
