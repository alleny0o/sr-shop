import { Migration } from '@mikro-orm/migrations';

export class Migration20250330044627 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "option_image" drop constraint if exists "option_image_option_value_id_unique";`);
    this.addSql(`alter table if exists "option_image" drop constraint if exists "option_image_file_id_unique";`);
    this.addSql(`alter table if exists "option_value" drop constraint if exists "option_value_option_value_id_unique";`);
    this.addSql(`alter table if exists "option_ui" drop constraint if exists "option_ui_option_id_unique";`);
    this.addSql(`create table if not exists "option_ui" ("id" text not null, "product_id" text not null, "option_id" text not null, "option_title" text not null, "display_type" text check ("display_type" in ('buttons', 'dropdown', 'colors', 'images')) not null default 'buttons', "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "option_ui_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_option_ui_option_id_unique" ON "option_ui" (option_id) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_option_ui_deleted_at" ON "option_ui" (deleted_at) WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "option_value" ("id" text not null, "option_value_id" text not null, "product_variant_id" text null, "color" text null, "option_ui_id" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "option_value_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_option_value_option_value_id_unique" ON "option_value" (option_value_id) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_option_value_option_ui_id" ON "option_value" (option_ui_id) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_option_value_deleted_at" ON "option_value" (deleted_at) WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "option_image" ("id" text not null, "file_id" text not null, "name" text not null, "size" integer not null, "mime_type" text not null, "url" text not null, "option_value_id" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "option_image_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_option_image_file_id_unique" ON "option_image" (file_id) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_option_image_option_value_id_unique" ON "option_image" (option_value_id) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_option_image_deleted_at" ON "option_image" (deleted_at) WHERE deleted_at IS NULL;`);

    this.addSql(`alter table if exists "option_value" add constraint "option_value_option_ui_id_foreign" foreign key ("option_ui_id") references "option_ui" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table if exists "option_image" add constraint "option_image_option_value_id_foreign" foreign key ("option_value_id") references "option_value" ("id") on update cascade on delete cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "option_value" drop constraint if exists "option_value_option_ui_id_foreign";`);

    this.addSql(`alter table if exists "option_image" drop constraint if exists "option_image_option_value_id_foreign";`);

    this.addSql(`drop table if exists "option_ui" cascade;`);

    this.addSql(`drop table if exists "option_value" cascade;`);

    this.addSql(`drop table if exists "option_image" cascade;`);
  }

}
