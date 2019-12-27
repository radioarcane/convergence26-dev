import sort from 'fast-sort';

export const sortCollection = (collection = [], keys = [], dir = 'asc') => {
   const sortKeys = keys.map(key => (item) => {
      return key.split('.').reduce((acc, part) => acc && acc[part], item);
   });

   return dir.toLowerCase() === 'desc' ?  sort(collection).desc(sortKeys) : sort(collection).asc(sortKeys);
};

export default sortCollection;
