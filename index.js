
class MusicSequencer extends HTMLElement {

  static get observedAttributes() {return ['rows', 'cols', 'size']; }

  constructor() {

    super();

    // Attributes
    this.attributesRows = this.hasAttribute('rows')?parseInt(this.getAttribute('rows')):4;
    this.attributesCols = this.hasAttribute('cols')?parseInt(this.getAttribute('cols')):8;
    this.attributesSize = this.hasAttribute('size')?this.getAttribute('size'):'32';

    this.matrix = [];
    this.updateMatrix()

    // Create a shadow root
    const shadow = this.attachShadow({mode: 'open'});


    // Create Internal UI

    const wrapper = document.createElement('div');
    wrapper.setAttribute('class', 'sequencer table-responsive-md');

    const table = document.createElement("table");
    wrapper.appendChild(table);

    this.tbody = document.createElement("tbody");
    table.appendChild(this.tbody);

    this.elements = [];
    this.updateGrid()

    // Create some CSS to apply to the shadow dom
    this.styleElement = document.createElement('style');
    this.updateStyle();

    // Attach the created elements to the shadow dom
    shadow.appendChild(this.styleElement);
    shadow.appendChild(wrapper);

    var readyEvent = new CustomEvent('ready', { detail: this.matrix });
    this.dispatchEvent(readyEvent);
  }

  mark(col){

    this.unmark();
    const rows = this.elements[col].length;
    for(let row = 0; row < rows-1; row++){
      this.elements[col][row].classList.add("position-active");
    }
    console.log(`Sequencer marking rows in column ${col}`, rows)

  }

  unmark(){
    const cols = this.elements.length;
    for(let col = 0; col < cols; col++){
      const rows = this.elements[col].length;
      for(let row = 0; row < rows; row++){

          this.elements[col][row].classList.remove("position-active");

      }
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    // console.log('Custom square element attributes changed.');
    // updateStyle(this);
    console.log(`attributeChanged: ${name}: ${oldValue}->${newValue}`)

    // property updates

    if(name === 'size') {
      this.attributesSize = newValue;
    }

    if(name === 'cols') {
      this.attributesCols = parseInt(newValue);
    }

    if(name === 'rows') {
      this.attributesRows = parseInt(newValue);
    }

    // actions

    if(name === 'size') {
      this.updateStyle();
    }

    if((name === 'cols')||(name === 'rows')) {
      this.updateMatrix();
      this.updateGrid();
    }


  }

  destroyMatrix(){
    this.matrix = [];
  }
  updateMatrix(){
    this.destroyMatrix();
    this.matrix = new Array(this.attributesCols);
    for (var col = 0; col < this.attributesCols; col++) {
      this.matrix[col] = new Array(this.attributesRows);
      for (var row = 0; row < this.attributesRows; row++){
        this.matrix[col][row] = false;
      }
    }
  }



  destroyStyle(){
    this.styleElement.textContent = ``;
  }

  updateStyle(){
    this.destroyStyle();

    const cssData = `
      table.music-sequencer td {
        border: 2px solid white;
        background: #ccc;
        min-width: ${this.attributesSize}px;
        height: ${this.attributesSize}px;
      }
      table.music-sequencer .position-enabled {
        background: #666;
      }
      table.music-sequencer .position-active {
        border-bottom: 2px solid #bbb;
      }
    `;

    this.styleElement.textContent = cssData;
    console.log('Style Updated', cssData)
  }


  destroyGrid(){

    const cols = this.elements.length;
    for(let col = 0; col < cols; col++){
      const rows = this.elements[col].length;
      for(let row = 0; row < rows; row++){
        const position = this.elements[col][row];
        position.removeEventListener('mousedown', position.clickHandler)
        position.removeEventListener('mouseover', position.clickHandler)
        position.remove();
      }
    }
  }

  updateGrid(){

    this.destroyGrid();
    this.elements = new Array(this.attributesCols);
    for (var col = 0; col < this.attributesCols; col++) {
      this.elements[col] = new Array(this.attributesRows);
    }

    for(let y = 0; y < this.attributesRows; y++){

      const row = document.createElement("tr");
      row.setAttribute('class', 'sequencer-row')

      for(let x = 0; x < this.attributesCols; x++){

        const position = document.createElement("td");
        this.elements[x][y] = position;

        position.setAttribute('class', 'row-position');

        const that = this;

        const handler = function(){
          const currentValue = that.matrix[x][y];
          if(currentValue === true){
            that.matrix[x][y] = false;
            that.elements[x][y].classList.remove("position-enabled");
          }else{
            that.matrix[x][y] = true;
            that.elements[x][y].classList.add("position-enabled");
          }
          var changeEvent = new CustomEvent('change', { detail: that.matrix });
          that.dispatchEvent(changeEvent);
        }

        position.clickHandler = function(e){ if(e.buttons === 1) handler() }
        position.addEventListener( 'mousedown', position.clickHandler )
        position.addEventListener( 'mouseover', position.clickHandler )

        row.appendChild(position);


      }
      this.tbody.appendChild(row);
    }

  }


}

// Define the new element
customElements.define('music-sequencer', MusicSequencer);
