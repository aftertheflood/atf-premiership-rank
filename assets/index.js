const tableToData = (tableBody)=>{
  const tableData = [];
  tableBody.querySelectorAll('tr')
    .forEach(row=>{
      const rowData = [];
      row.querySelectorAll('td')
        .forEach(cell=>{
          rowData.push(cell.innerText);
        })
      tableData.push(rowData);
    });
  return tableData;
};

const dataToTable = (tableBody, tableData)=>{
  tableBody.querySelectorAll('tr')
    .forEach((row, i)=>{
      const rowData = tableData[i];
      row.querySelectorAll('td')
        .forEach((cell, j)=>{
          cell.innerText = rowData[j];
        })
      tableData.push(rowData);
    });
}

const sortTable = (columnNumber, method, direction) => {
  const tableData = tableToData(document.querySelector('table tbody'));

  // sort the data
  if(method == 'numeric'){
    tableData.sort((a, b)=>{
      return direction * (Number(a[columnNumber]) - Number(b[columnNumber]))
    });
  }else{
    tableData.sort((a, b)=>{
      if(b[columnNumber].toLowerCase() > a[columnNumber].toLowerCase()){
        return -1 * direction;
      }
      return 1 * direction;
    });
  }
  // put the data back into the table
  dataToTable(document.querySelector('table tbody'), tableData);
}


function addInteraction(){
  document.querySelector('table')
  .querySelectorAll('th')
    .forEach((element, i)=>{
      let method = 'alphabetical';
      if(element.classList.contains('number')){
        method = 'numeric'
      }
      element.addEventListener('click', event => {
        let sortDir = 1;
        if(element.getAttribute('data-sorted')){
          sortDir = element.getAttribute('data-sorted') * -1;
        }
        sortTable(i, method, sortDir);
        // mark as sorted
        element.setAttribute('data-sorted', sortDir)
      });
    });
}

window.onload = addInteraction;
