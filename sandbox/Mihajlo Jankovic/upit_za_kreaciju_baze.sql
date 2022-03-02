create database Baza

go

use Baza

create table movies
(
	id int IDENTITY(1,1) primary key,
	name nvarchar(50) not null,
	description nvarchar(50) not null,
	rating float not null
)

INSERT INTO [dbo].[movies] VALUES ('The Shawshank Redemption','Opis...', 9.2)
INSERT INTO [dbo].[movies] VALUES ('The Godfather','Opis...', 9.1)
INSERT INTO [dbo].[movies] VALUES ('The Godfather: Part II','Opis...', 9)