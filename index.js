
class MusicSequencer extends HTMLElement {

  constructor() {

    super();

    // Attributes
    let rows = this.hasAttribute('rows')?parseInt(this.getAttribute('rows')):4;
    let cols = this.hasAttribute('cols')?parseInt(this.getAttribute('cols')):8;
    let size = this.hasAttribute('size')?this.getAttribute('cols'):'32px';

    if(size.match(/^\d+$/)) size += 'px';

    this.matrix = new Array(rows);
    for (var i = 0; i < rows; i++) {
      this.matrix[i] = new Array(cols);
    }

    this.elements = new Array(rows);
    for (var i = 0; i < rows; i++) {
      this.elements[i] = new Array(cols);
    }

    // Create a shadow root
    const shadow = this.attachShadow({mode: 'open'});


    // Create Internal UI

    const wrapper = document.createElement('div');
    wrapper.setAttribute('class', 'sequencer table-responsive-md');

    const table = document.createElement("table");
    wrapper.appendChild(table);

    const tbody = document.createElement("tbody");
    table.appendChild(tbody);

    for(let y = 0; y < rows; y++){

      const row = document.createElement("tr");
      row.setAttribute('class', 'sequencer-row')

      for(let x = 0; x < cols; x++){

        const position = document.createElement("td");
        this.elements[y][x] = position;

        position.setAttribute('class', 'row-position');

        const that = this;

        const handler = function(){
          const currentValue = that.matrix[y][x];
          if(currentValue === true){
            that.matrix[y][x] = false;
            that.elements[y][x].classList.remove("position-enabled");
          }else{
            that.matrix[y][x] = true;
            that.elements[y][x].classList.add("position-enabled");
          }
          var changeEvent = new CustomEvent('change', { detail: that.matrix });
          that.dispatchEvent(changeEvent);
        }

        position.addEventListener('mousedown', function(e){ if(e.buttons === 1) handler() })
        position.addEventListener('mouseover', function(e){ if(e.buttons === 1) handler() })

        row.appendChild(position);


      }
      tbody.appendChild(row);
    }

    // Create some CSS to apply to the shadow dom
    const style = document.createElement('style');


    style.textContent = `
      table.music-sequencer td {
        border: 2px solid white;
        background: #ccc;
        min-width: ${size};
        height: ${size};
      }
      table.music-sequencer .position-enabled {
        background: #666;
      }
    `;

    // Attach the created elements to the shadow dom
    shadow.appendChild(style);
    shadow.appendChild(wrapper);

  }



}

// Define the new element
customElements.define('music-sequencer', MusicSequencer);
