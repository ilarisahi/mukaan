import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

    transform(items: any[], args?: any): any {
        console.log('transforming...' + args);
        if (!items || !args) {
            return items;
        }

        return items.filter((item, i) => {
            for (let attr in item) {
                if (item[attr].toString().toLowerCase().includes(args.toString().toLowerCase())) return true;
            }
            return false;
        });
  }

}
