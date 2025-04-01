import { Migration } from '@mikro-orm/migrations';

export class Migration20250401002801 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "option_config" drop constraint if exists "option_config_option_id_unique";`);
    this.addSql(`alter table if exists "option_value" drop constraint if exists "option_value_option_ui_id_foreign";`);

    this.addSql(`create table if not exists "option_config" ("id" text not null, "product_id" text not null, "option_id" text not null, "option_title" text not null, "is_selected" boolean not null, "display_type" text check ("display_type" in ('buttons', 'dropdown', 'colors', 'images')) not null default 'buttons', "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "option_config_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_option_config_option_id_unique" ON "option_config" (option_id) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_option_config_deleted_at" ON "option_config" (deleted_at) WHERE deleted_at IS NULL;`);

    this.addSql(`drop table if exists "option_ui" cascade;`);

    this.addSql(`drop index if exists "IDX_option_value_option_ui_id";`);

    this.addSql(`alter table if exists "option_value" rename column "option_ui_id" to "option_config_id";`);
    this.addSql(`alter table if exists "option_value" add constraint "option_value_option_config_id_foreign" foreign key ("option_config_id") references "option_config" ("id") on update cascade on delete cascade;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_option_value_option_config_id" ON "option_value" (option_config_id) WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "option_value" drop constraint if exists "option_value_option_config_id_foreign";`);

    this.addSql(`create table if not exists "option_ui" ("id" text not null, "product_id" text not null, "option_id" text not null, "option_title" text not null, "is_selected" boolean not null, "display_type" text check ("display_type" in ('buttons', 'dropdown', 'colors', 'images')) not null default 'buttons', "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "option_ui_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_option_ui_option_id_unique" ON "option_ui" (option_id) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_option_ui_deleted_at" ON "option_ui" (deleted_at) WHERE deleted_at IS NULL;`);

    this.addSql(`drop table if exists "option_config" cascade;`);

    this.addSql(`drop index if exists "IDX_option_value_option_config_id";`);

    this.addSql(`alter table if exists "option_value" rename column "option_config_id" to "option_ui_id";`);
    this.addSql(`alter table if exists "option_value" add constraint "option_value_option_ui_id_foreign" foreign key ("option_ui_id") references "option_ui" ("id") on update cascade on delete cascade;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_option_value_option_ui_id" ON "option_value" (option_ui_id) WHERE deleted_at IS NULL;`);
  }

}
