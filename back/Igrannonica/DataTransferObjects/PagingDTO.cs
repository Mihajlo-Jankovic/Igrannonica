﻿namespace Igrannonica.DataTransferObjects
{
    public class PagingDTO
    {
        public string Visibility { get; set; }
        public int PageNum { get; set; }
        public int NumPerPage { get; set; }
        public int NumOfPages { get; set; }
    }
}
