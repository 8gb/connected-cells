import * as React from "react"
import './App.css';

interface IState {
  xaxis?: any;
  yaxis?: any;
  agrid?: any;
  amaxdisplay?: any;
  adisplay?: any;
  listnumber?: string
}
interface IProps { }

class App extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = {
      xaxis: 10,
      yaxis: 5,
      agrid: [],
      amaxdisplay: [],
      adisplay: [],
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleYChange = this.handleYChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.singleChange = this.singleChange.bind(this);
  }

  componentDidMount() {
    this.paintIt()
  }

  paintIt() {
    //1. set the number
    var xNumber = this.state.xaxis
    var yNumber = this.state.yaxis
    var grid = []

    for (var i = 0; i < yNumber; i++) {
      var line = []
      for (var j = 0; j < xNumber; j++) {
        var value = (Math.floor((Math.random() * 2) % 2)) ? "1" : "0"
        line.push(value)
      }
      grid.push(line)
    }
    this.setState({ agrid: grid });

    //2. find the regions and set the display
    this.setDisplayFindRegions(grid)
  }

  singleChange(e: any) {
    var arr = this.state.agrid
    var x = e.target.id;
    var y = e.currentTarget.name;

    //toggle
    if (arr[y][x] === '1') {
      arr[y][x] = "0";
    } else {
      arr[y][x] = "1";
    }
    this.setDisplayFindRegions(arr)
  }


  setDisplayFindRegions(arr: any) {
    var xNumber = this.state.xaxis
    var yNumber = this.state.yaxis
    var display = []
    var maxDisplay = []

    //a. display the visuals
    for (var i = 0; i < yNumber; i++) {
      var visualButtons: any[] = [];
      for (var j = 0; j < xNumber; j++) {
        var value = arr[i][j]
        if (value === "1")
          visualButtons.push(<button type="button" className="btn btn-danger" name={'' + i} id={'' + j} onClick={this.singleChange}>{value}</button>)
        else
          visualButtons.push(<button type="button" className="btn btn-light" name={'' + i} id={'' + j} onClick={this.singleChange}>{value}</button>)
      }
      display.push(<br></br>)
      display.push(visualButtons)
    }

    //b. find regions
    var lists: any[] = [];
    function checkTheLists(id: string) {
      for (var i = 0; i < lists.length; i++) {
        if (lists[i].includes(id)) {
          // return the list index
          return '' + i
        }
      }
      return 'non'
    }

    for (var i = 0; i < yNumber; i++) {
      for (var j = 0; j < xNumber; j++) {
        var digit = arr[i][j]
        var id = "" + i + "_" + j
        var listnumber = checkTheLists(id)
        //for each button
        if (digit === "1") {
          //1. if the button is a one, check the entire lists
          if (listnumber === 'non') {
            //not in the entire lists, adding it
            var list = []
            list.push(id)
            lists.push(list)
            //console.log('added it to list number ' + listnumber)
          } else {
            //console.log('already in the lists ' + listnumber + ', skip...')
          }

          //2. checking surrounding
          for (var v = -1; v < 2; v++) {
            for (var b = -1; b < 2; b++) {

              //make sure both bias are not zero
              if (v === b && v === 0) { } else {

                // make sure the coordinates is not negative, for top and left boundaries
                if (i + v >= 0 && j + b >= 0) {
                  //make sure the coordinates does not exeed the limit, for bottom and right boundaries 
                  if (i + v < yNumber && j + b < xNumber) {

                    var yyy = i + v
                    var xxx = j + b
                    //console.log("__checking surround buttons: arr[" + yyy + '][' + xxx + ']')
                    var idd = yyy + '_' + xxx
                    var smallDigit = arr[yyy][xxx]

                    // surrounding button is a one
                    if (smallDigit === "1") {
                      listnumber = checkTheLists(id)
                      var surlistnumber = checkTheLists(idd)
                      var surnumber = parseInt(surlistnumber)
                      //console.log('___is one! check is in list ' + surlistnumber)
                      //console.log('___will put it in the list ' + listnumber)

                      var number = parseInt(listnumber)
                      //check the list and do the processing
                      if (surlistnumber === 'non') {
                        lists[number].push(idd)
                        //console.log(' _has put it to list number ' + listnumber)
                      } else {
                        if (listnumber !== surlistnumber) {
                          lists[surnumber].push(...lists[number])
                          lists[number] = []
                          //console.log('_has merge list ' + listnumber + 'to list ' + surlistnumber)
                        }

                      }
                    }

                  }
                }

              }
            }
          }
        }
      }
    }

    display.push(<br></br>);
    // display.push('lists: '  + JSON.stringify(lists));
    this.setState({ adisplay: display });


    //finding the largest region
    var max = 0
    lists.forEach(function (e) {
      if (e.length > max)
        max = e.length
    });
    maxDisplay.push('The largest region is ' + max);
    this.setState({ amaxdisplay: maxDisplay });
  }

  handleChange(event: any) {
    this.setState({ xaxis: event.target.value });
  }
  handleYChange(event: any) {
    this.setState({ yaxis: event.target.value });
  }

  handleSubmit(event: any) {
    event.preventDefault();
    this.paintIt()
  }

  render() {

    return (
      <div className="App">
        <a href="https://github.com/8gb/connected-cells" target="_blank">github</a>
        <br></br>
        <form className="Appo" onSubmit={this.handleSubmit}>

          <div className="form-row">
            <div className="form-group col-md-6">
              <label>x axis:</label>
              <input className="form-control" type="text" value={this.state.xaxis} onChange={this.handleChange} />
            </div>
            <div className="form-group col-md-6">
              <label>y axis:</label>
              <input className="form-control" type="text" value={this.state.yaxis} onChange={this.handleYChange} />
            </div>
          </div>

          <input className="btn btn-primary" type="submit" value="Refresh" />
        </form>
        <hr></hr>
        <div>
          <h3>{this.state.amaxdisplay}</h3>
          {this.state.adisplay}

        </div>
      </div>
    );
  }
}

export default App;
