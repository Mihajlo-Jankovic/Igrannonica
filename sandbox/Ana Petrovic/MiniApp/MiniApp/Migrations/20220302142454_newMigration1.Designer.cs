﻿// <auto-generated />
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using MiniApp.Models;

namespace MiniApp.Migrations
{
    [DbContext(typeof(BibliotekaContext))]
    [Migration("20220302142454_newMigration1")]
    partial class newMigration1
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .UseIdentityColumns()
                .HasAnnotation("Relational:MaxIdentifierLength", 128)
                .HasAnnotation("ProductVersion", "5.0.0");

            modelBuilder.Entity("MiniApp.Models.Biblioteka", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .UseIdentityColumn();

                    b.Property<string>("Autor")
                        .HasColumnType("nvarchar(50)");

                    b.Property<string>("Izdanje")
                        .HasColumnType("nvarchar(5)");

                    b.Property<string>("NazivKnjige")
                        .HasColumnType("nvarchar(50)");

                    b.HasKey("Id");

                    b.ToTable("Biblioteke");
                });
#pragma warning restore 612, 618
        }
    }
}
