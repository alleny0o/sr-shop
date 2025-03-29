import { Migration } from '@mikro-orm/migrations';

export class Migration20250329201923 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "field_image" drop constraint if exists "field_image_product_form_field_id_unique";`);
    this.addSql(`alter table if exists "field_image" drop constraint if exists "field_image_file_id_unique";`);
    this.addSql(`alter table if exists "product_form_field" drop constraint if exists "product_form_field_uuid_unique";`);
    this.addSql(`alter table if exists "product_form" drop constraint if exists "product_form_product_id_unique";`);
    this.addSql(`create table if not exists "product_form" ("id" text not null, "product_id" text not null, "name" text null, "active" boolean not null default false, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "product_form_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_product_form_product_id_unique" ON "product_form" (product_id) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_product_form_deleted_at" ON "product_form" (deleted_at) WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "product_form_field" ("id" text not null, "uuid" text not null, "label" text null, "description" text null, "placeholder" text null, "options" text[] null, "required" boolean not null default false, "input_type" text check ("input_type" in ('text', 'textarea', 'dropdown', 'images')) not null, "max_file_size" integer null, "max_images" integer null, "image_ratios" text[] null, "product_form_id" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "product_form_field_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_product_form_field_uuid_unique" ON "product_form_field" (uuid) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_product_form_field_product_form_id" ON "product_form_field" (product_form_id) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_product_form_field_deleted_at" ON "product_form_field" (deleted_at) WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "field_image" ("id" text not null, "file_id" text not null, "name" text not null, "size" integer not null, "mime_type" text not null, "url" text not null, "product_form_field_id" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "field_image_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_field_image_file_id_unique" ON "field_image" (file_id) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_field_image_product_form_field_id_unique" ON "field_image" (product_form_field_id) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_field_image_deleted_at" ON "field_image" (deleted_at) WHERE deleted_at IS NULL;`);

    this.addSql(`alter table if exists "product_form_field" add constraint "product_form_field_product_form_id_foreign" foreign key ("product_form_id") references "product_form" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table if exists "field_image" add constraint "field_image_product_form_field_id_foreign" foreign key ("product_form_field_id") references "product_form_field" ("id") on update cascade on delete cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "product_form_field" drop constraint if exists "product_form_field_product_form_id_foreign";`);

    this.addSql(`alter table if exists "field_image" drop constraint if exists "field_image_product_form_field_id_foreign";`);

    this.addSql(`drop table if exists "product_form" cascade;`);

    this.addSql(`drop table if exists "product_form_field" cascade;`);

    this.addSql(`drop table if exists "field_image" cascade;`);
  }

}
