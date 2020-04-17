import Person from "@/types/Person";

export default class SearchResult {
   persons: Person[];
   pageNumber:number;
   pageSize:number;
   totalElements:number;

   constructor(persons:Person[], pageNumber:number, pageSize:number, totalElements:number) {
      this.persons = persons;
      this.pageNumber = pageNumber;
      this.pageSize = pageSize;
      this.totalElements = totalElements;
   }
}