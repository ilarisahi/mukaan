import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'pagination'
})
export class PaginationPipe implements PipeTransform {

    transform(items: any[], args?: any): any {
        console.log('transforming...' + args);
        if (!items || !args) {
            return items;
        }
        return items.filter((item, i) => {
            return ((i >= (args * 10 - 10)) && (i < (args * 10)));
        });
        
  }

}
