create database bamazon_db;

use bamazon_db;

create table products (
item_id integer (2),
product_name varchar(30) not null,
department_name varchar(30) not null,
price decimal (19,2) not null,
stock_quantity integer (2),
primary key (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("cute_dress", "apparel", 22.95, 8);

