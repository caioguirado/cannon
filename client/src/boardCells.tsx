export type BoardCell = {
    id: string;
    value: string;
};
export const boardCells = [...Array(81).keys()];

// export const boardCells = [{id: '1', value: 'p'},
//                         {id: '2', value: 'p'},
//                         {id: '3', value: 'p'},
//                         {id: '4', value: 'p'},
//                         {id: '5', value: 'p'},
//                         {id: '6', value: 'p'},
//                         {id: '7', value: 'p'},
//                         {id: '8', value: 'p'},
//                         {id: '9', value: 'p'},
                        
//                         {id: '10', value: 'p'},
//                         {id: '11', value: 'p'},
//                         {id: '12', value: 'p'},
//                         {id: '13', value: 'p'},
//                         {id: '14', value: 'p'},
//                         {id: '15', value: 'p'},
//                         {id: '16', value: 'p'},
//                         {id: '17', value: 'p'},
//                         {id: '18', value: 'p'},
                        
//                         {id: '19', value: 'none'},
//                         {id: '20', value: 'none'},
//                         {id: '21', value: 'none'},
//                         {id: '22', value: 'none'},
//                         {id: '23', value: 'none'},
//                         {id: '24', value: 'none'},
//                         {id: '25', value: 'none'},
//                         {id: '26', value: 'none'},
//                         {id: '27', value: 'none'},
                        
//                         {id: '28', value: 'none'},
//                         {id: '29', value: 'none'},
//                         {id: '30', value: 'none'},
//                         {id: '31', value: 'none'},
//                         {id: '32', value: 'none'},
//                         {id: '33', value: 'none'},
//                         {id: '34', value: 'none'},
//                         {id: '35', value: 'none'},
//                         {id: '36', value: 'none'},
                        
//                         {id: '37', value: 'none'},
//                         {id: '38', value: 'none'},
//                         {id: '39', value: 'none'},
//                         {id: '40', value: 'none'},
//                         {id: '41', value: 'none'},
//                         {id: '42', value: 'none'},
//                         {id: '43', value: 'none'},
//                         {id: '44', value: 'none'},
//                         {id: '45', value: 'none'},
                        
//                         {id: '46', value: 'none'},
//                         {id: '47', value: 'none'},
//                         {id: '48', value: 'none'},
//                         {id: '49', value: 'none'},
//                         {id: '50', value: 'none'},
//                         {id: '51', value: 'none'},
//                         {id: '52', value: 'none'},
//                         {id: '53', value: 'none'},
//                         {id: '54', value: 'none'},
                        
//                         {id: '55', value: 'p'},
//                         {id: '56', value: 'p'},
//                         {id: '57', value: 'p'},
//                         {id: '58', value: 'p'},
//                         {id: '59', value: 'p'},
//                         {id: '60', value: 'p'},
//                         {id: '61', value: 'p'},
//                         {id: '62', value: 'p'},
//                         {id: '63', value: 'p'},
                        
//                         {id: '64', value: 'p'},
//                         {id: '65', value: 'p'},
//                         {id: '66', value: 'p'},
//                         {id: '67', value: 'p'},
//                         {id: '68', value: 'p'},
//                         {id: '69', value: 'p'},
//                         {id: '70', value: 'p'},
//                         {id: '71', value: 'p'},
//                         {id: '72', value: 'p'},
                        
//                         {id: '73', value: 'p'},
//                         {id: '74', value: 'p'},
//                         {id: '75', value: 'p'},
//                         {id: '76', value: 'p'},
//                         {id: '77', value: 'p'},
//                         {id: '78', value: 'p'},
//                         {id: '79', value: 'p'},
//                         {id: '80', value: 'p'},
//                         {id: '81', value: 'p'}
//                     ]