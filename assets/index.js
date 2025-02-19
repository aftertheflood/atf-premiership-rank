const tableToData = (tableBody)=>{
  const tableData = [];
  tableBody.querySelectorAll('tr')
    .forEach(row=>{
      const rowData = [];
      row.querySelectorAll('td')
        .forEach(cell=>{
          rowData.push({
            value: cell.innerText,
            html: cell.innerHTML,
            sortvalue: cell.dataset.sortvalue
          });
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
          cell.innerHTML = rowData[j].html;
          cell.setAttribute('data-sortvalue', rowData[j].sortvalue);
        })
      tableData.push(rowData);
    });
}

const sortTable = (columnNumber, method, direction) => {
  const tableData = tableToData(document.querySelector('table tbody'));
  // mark all cells unsorted
  document.querySelectorAll('td, th')
    .forEach((el)=>{
      el.classList.remove( 'sorted-on' );
      el.classList.remove( 'sorted-asc' );
      el.classList.remove( 'sorted-desc' );
    });

  // sort the data
  if(method == 'numeric'){
    tableData.sort((a, b)=>{
      return direction * (Number(a[columnNumber].value) - Number(b[columnNumber].value));
    });
  }else{
    tableData.sort((a, b)=>{
      if(a[columnNumber].sortvalue && b[columnNumber].sortvalue){
        return direction * (Number(a[columnNumber].sortvalue) - Number(b[columnNumber].sortvalue))  
      }
      if(b[columnNumber].value.toLowerCase() > a[columnNumber].value.toLowerCase()){
        return -1 * direction;
      }
      return 1 * direction;
    });
  }
  // put the data back into the table
  dataToTable(document.querySelector('table tbody'), tableData);
  //mark the sorted column
  document.querySelectorAll('tr')
    .forEach((el)=>{
      el.querySelectorAll('td, th')
        .forEach((el, i)=>{
          if(i==columnNumber){
            el.classList.add( 'sorted-on' );
            if(direction===-1){
              el.classList.add( 'sorted-desc' );
            }else{
              el.classList.add( 'sorted-asc' );
            }
          }
        })
    })

}


function addInteraction(){
  update();
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

function update(){
  const shapes = [
      [[0,0],[0,6],[4,6]], //L
      [[3,0],[5,6],[6.5,.7],[8,6],[10,0]], //W
      [[9,6],[13,6],[13,0]] // L but backwards
  ];
  const svg = d3.select('svg#logo');
  const size = svg.node().getBoundingClientRect(); 
  const xScale = d3.scaleLinear()
      .domain([0,13])
      .range([0,size.width]);
  const yScale = d3.scaleLinear()
      .domain([0,6])
      .range([0,size.height]);
  const line = d3.line()
      .x(d=>xScale(d[0]))
      .y(d=>yScale(d[1]))
  svg.selectAll('path')
      .data(shapes)
      .enter()
      .append('path')
      .attr('fill','none')
      .attr('stroke','white');
  
  svg.selectAll('path')
      .attr('d', line);
}

window.addEventListener('resize', update);
window.onload = addInteraction;
