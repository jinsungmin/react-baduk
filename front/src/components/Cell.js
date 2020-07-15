import React, { Component } from 'react';

//import Images from '../assets/Images';

const whiteStone = require('../assets/img/white-stone.png');
const blackStone = require('../assets/img/black-stone.png');

export default class Cell extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);

    this.state = {
      clicked: false,
      turn: 0,
    }
  }

  handleClick = () => {
    
    console.log('this is:', this);
    
    
    this.setState({
      clicked: true,  
    }, () => {
      this.props.turnCount(this.props.x, this.props.y);
      console.log('turn is:', this.state.turn);
    });
  }

  reset = () => {
    this.setState({
      clicked: false,
    })
  }

  render() {
    if (!this.state.clicked) {  // 바둑판 클릭 전.
      if (this.props.y == 0) {
        if (this.props.x == 0) {  // 바둑판 왼쪽 위 끝
          return (
            <div
              onClick={this.handleClick}
              style={{
                width: this.props.width + 2,
                height: this.props.height + 2,
                backgroundColor: '#ffcc33',
            }}>
              <div style={{
                width: this.props.width + 2,
                height: this.props.height / 2 + 1,
              }}>
                <div style={{
                  width: this.props.width / 2,
                  height: this.props.height / 2,
                  display: 'inline-block',
                  float: 'left',
                  borderBottom: '1px solid #ffcc33',
                  borderRight: '1px solid #ffcc33',
                
                }}>
                  
                </div>
                <div style={{
                  width: this.props.width / 2,
                  height: this.props.height / 2,
                  display: 'inline-block',
                  float: 'left',
                  borderBottom: '1px solid black',
                  borderLeft: '1px solid #ffcc33',
                }}>

                </div>
              </div>

              <div style={{
                width: this.props.width + 2,
                height: this.props.height / 2 + 1,
              }}>
                <div style={{
                  width: this.props.width / 2,
                  height: this.props.height / 2,
                  display: 'inline-block',
                  float: 'left',
                  borderTop: '1px solid #ffcc33',
                  borderRight: '1px solid black',
                }}>

                </div>
                <div style={{
                  width: this.props.width / 2,
                  height: this.props.height / 2,
                  display: 'inline-block',
                  float: 'left',
                  borderTop: '1px solid black',
                  borderLeft: '1px solid black',
                }}>

                </div>
              </div>

            </div>
          )
        } else if (this.props.x == 18) {  // 바둑판 오른쪽 위 끝
          return (
            <div
              onClick={this.handleClick} 
              style={{
              width: this.props.width + 2,
              height: this.props.height + 2,
              backgroundColor: '#ffcc33',
            }}>
              <div style={{
                width: this.props.width + 2,
                height: this.props.height / 2 + 1,
              }}>
                <div style={{
                  width: this.props.width / 2,
                  height: this.props.height / 2,
                  display: 'inline-block',
                  float: 'left',
                  borderBottom: '1px solid black',
                  borderRight: '1px solid #ffcc33',
                }}>

                </div>
                <div style={{
                  width: this.props.width / 2,
                  height: this.props.height / 2,
                  display: 'inline-block',
                  float: 'left',
                  borderBottom: '1px solid #ffcc33',
                  borderLeft: '1px solid #ffcc33',
                }}>

                </div>
              </div>

              <div style={{
                width: this.props.width + 2,
                height: this.props.height / 2 + 1,
              }}>
                <div style={{
                  width: this.props.width / 2,
                  height: this.props.height / 2,
                  display: 'inline-block',
                  float: 'left',
                  borderTop: '1px solid black',
                  borderRight: '1px solid black',
                }}>

                </div>
                <div style={{
                  width: this.props.width / 2,
                  height: this.props.height / 2,
                  display: 'inline-block',
                  float: 'left',
                  borderTop: '1px solid #ffcc33',
                  borderLeft: '1px solid black',
                }}>

                </div>
              </div>

            </div>
          )
        } else {  // 바둑판 가장위 
          return (
            <div 
            onClick={this.handleClick}
            style={{
              width: this.props.width + 2,
              height: this.props.height + 2,
              backgroundColor: '#ffcc33',
            }}>
              <div style={{
                width: this.props.width + 2,
                height: this.props.height / 2 + 1,
              }}>
                <div style={{
                  width: this.props.width / 2,
                  height: this.props.height / 2,
                  display: 'inline-block',
                  float: 'left',
                  borderBottom: '1px solid black',
                  borderRight: '1px solid #ffcc33',
                }}>

                </div>
                <div style={{
                  width: this.props.width / 2,
                  height: this.props.height / 2,
                  display: 'inline-block',
                  float: 'left',
                  borderBottom: '1px solid black',
                  borderLeft: '1px solid #ffcc33',
                }}>

                </div>
              </div>

              <div style={{
                width: this.props.width + 2,
                height: this.props.height / 2 + 1,
              }}>
                <div style={{
                  width: this.props.width / 2,
                  height: this.props.height / 2,
                  display: 'inline-block',
                  float: 'left',
                  borderTop: '1px solid black',
                  borderRight: '1px solid black',
                }}>

                </div>
                <div style={{
                  width: this.props.width / 2,
                  height: this.props.height / 2,
                  display: 'inline-block',
                  float: 'left',
                  borderTop: '1px solid black',
                  borderLeft: '1px solid black',
                }}>

                </div>
              </div>

            </div>
          )
        }

      } else if (this.props.y == 18) {
        if (this.props.x == 0) {  // 바둑판 왼쪽 아래 끝
          return (
            <div 
            onClick={this.handleClick}
            style={{
              width: this.props.width + 2,
              height: this.props.height + 2,
              backgroundColor: '#ffcc33',
            }}>
              <div style={{
                width: this.props.width + 2,
                height: this.props.height / 2 + 1,
              }}>
                <div style={{
                  width: this.props.width / 2,
                  height: this.props.height / 2,
                  display: 'inline-block',
                  float: 'left',
                  borderBottom: '1px solid #ffcc33',
                  borderRight: '1px solid black',
                }}>

                </div>
                <div style={{
                  width: this.props.width / 2,
                  height: this.props.height / 2,
                  display: 'inline-block',
                  float: 'left',
                  borderBottom: '1px solid black',
                  borderLeft: '1px solid black',
                }}>

                </div>
              </div>

              <div style={{
                width: this.props.width + 2,
                height: this.props.height / 2 + 1,
              }}>
                <div style={{
                  width: this.props.width / 2,
                  height: this.props.height / 2,
                  display: 'inline-block',
                  float: 'left',
                  borderTop: '1px solid #ffcc33',
                  borderRight: '1px solid #ffcc33',
                }}>

                </div>
                <div style={{
                  width: this.props.width / 2,
                  height: this.props.height / 2,
                  display: 'inline-block',
                  float: 'left',
                  borderTop: '1px solid black',
                  borderLeft: '1px solid #ffcc33',
                }}>

                </div>
              </div>

            </div>
          )
        } else if (this.props.x == 18) {  // 바둑판 오른쪽 아래 끝
          return (
            <div 
            onClick={this.handleClick}
            style={{
              width: this.props.width + 2,
              height: this.props.height + 2,
              backgroundColor: '#ffcc33',
            }}>
              <div style={{
                width: this.props.width + 2,
                height: this.props.height / 2 + 1,
              }}>
                <div style={{
                  width: this.props.width / 2,
                  height: this.props.height / 2,
                  display: 'inline-block',
                  float: 'left',
                  borderBottom: '1px solid black',
                  borderRight: '1px solid black',
                }}>

                </div>
                <div style={{
                  width: this.props.width / 2,
                  height: this.props.height / 2,
                  display: 'inline-block',
                  float: 'left',
                  borderBottom: '1px solid #ffcc33',
                  borderLeft: '1px solid black',
                }}>

                </div>
              </div>

              <div style={{
                width: this.props.width + 2,
                height: this.props.height / 2 + 1,
              }}>
                <div style={{
                  width: this.props.width / 2,
                  height: this.props.height / 2,
                  display: 'inline-block',
                  float: 'left',
                  borderTop: '1px solid black',
                  borderRight: '1px solid #ffcc33',
                }}>

                </div>
                <div style={{
                  width: this.props.width / 2,
                  height: this.props.height / 2,
                  display: 'inline-block',
                  float: 'left',
                  borderTop: '1px solid #ffcc33',
                  borderLeft: '1px solid #ffcc33',
                }}>

                </div>
              </div>

            </div>
          )
        } else {  // 바둑판 가장아래
          return (
            <div 
            onClick={this.handleClick}
            style={{
              width: this.props.width + 2,
              height: this.props.height + 2,
              backgroundColor: '#ffcc33',
            }}>
              <div style={{
                width: this.props.width + 2,
                height: this.props.height / 2 + 1,
              }}>
                <div style={{
                  width: this.props.width / 2,
                  height: this.props.height / 2,
                  display: 'inline-block',
                  float: 'left',
                  borderBottom: '1px solid black',
                  borderRight: '1px solid black',
                }}>

                </div>
                <div style={{
                  width: this.props.width / 2,
                  height: this.props.height / 2,
                  display: 'inline-block',
                  float: 'left',
                  borderBottom: '1px solid black',
                  borderLeft: '1px solid black',
                }}>

                </div>
              </div>

              <div style={{
                width: this.props.width + 2,
                height: this.props.height / 2 + 1,
              }}>
                <div style={{
                  width: this.props.width / 2,
                  height: this.props.height / 2,
                  display: 'inline-block',
                  float: 'left',
                  borderTop: '1px solid black',
                  borderRight: '1px solid #ffcc33',
                }}>

                </div>
                <div style={{
                  width: this.props.width / 2,
                  height: this.props.height / 2,
                  display: 'inline-block',
                  float: 'left',
                  borderTop: '1px solid black',
                  borderLeft: '1px solid #ffcc33',
                }}>

                </div>
              </div>

            </div>
          )
        }
      }
      else {
        if (this.props.x == 0) {  // 바둑판 중앙 왼쪽 끝
          return (
            <div 
            onClick={this.handleClick}
            style={{
              width: this.props.width + 2,
              height: this.props.height + 2,
              backgroundColor: '#ffcc33',
            }}>
              <div style={{
                width: this.props.width + 2,
                height: this.props.height / 2 + 1,
              }}>
                <div style={{
                  width: this.props.width / 2,
                  height: this.props.height / 2,
                  display: 'inline-block',
                  float: 'left',
                  borderBottom: '1px solid #ffcc33',
                  borderRight: '1px solid black',
                }}>

                </div>
                <div style={{
                  width: this.props.width / 2,
                  height: this.props.height / 2,
                  display: 'inline-block',
                  float: 'left',
                  borderBottom: '1px solid black',
                  borderLeft: '1px solid black',
                }}>

                </div>
              </div>

              <div style={{
                width: this.props.width + 2,
                height: this.props.height / 2 + 1,
              }}>
                <div style={{
                  width: this.props.width / 2,
                  height: this.props.height / 2,
                  display: 'inline-block',
                  float: 'left',
                  borderTop: '1px solid #ffcc33',
                  borderRight: '1px solid black',
                }}>

                </div>
                <div style={{
                  width: this.props.width / 2,
                  height: this.props.height / 2,
                  display: 'inline-block',
                  float: 'left',
                  borderTop: '1px solid black',
                  borderLeft: '1px solid black',
                }}>

                </div>
              </div>

            </div>
          )
        } else if (this.props.x == 18) { // 바둑판 중앙 오른쪽 끝
          return (
            <div 
            onClick={this.handleClick}
            style={{
              width: this.props.width + 2,
              height: this.props.height + 2,
              backgroundColor: '#ffcc33',
            }}>
              <div style={{
                width: this.props.width + 2,
                height: this.props.height / 2 + 1,
              }}>
                <div style={{
                  width: this.props.width / 2,
                  height: this.props.height / 2,
                  display: 'inline-block',
                  float: 'left',
                  borderBottom: '1px solid black',
                  borderRight: '1px solid black',
                }}>

                </div>
                <div style={{
                  width: this.props.width / 2,
                  height: this.props.height / 2,
                  display: 'inline-block',
                  float: 'left',
                  borderBottom: '1px solid #ffcc33',
                  borderLeft: '1px solid black',
                }}>

                </div>
              </div>

              <div style={{
                width: this.props.width + 2,
                height: this.props.height / 2 + 1,
              }}>
                <div style={{
                  width: this.props.width / 2,
                  height: this.props.height / 2,
                  display: 'inline-block',
                  float: 'left',
                  borderTop: '1px solid black',
                  borderRight: '1px solid black',
                }}>

                </div>
                <div style={{
                  width: this.props.width / 2,
                  height: this.props.height / 2,
                  display: 'inline-block',
                  float: 'left',
                  borderTop: '1px solid #ffcc33',
                  borderLeft: '1px solid black',
                }}>

                </div>
              </div>

            </div>
          )
        } else {    
          return (
            <div 
            onClick={this.handleClick}
            style={{
              width: this.props.width + 2,
              height: this.props.height + 2,
              backgroundColor: '#ffcc33',
            }}>
              <div style={{
                width: this.props.width + 2,
                height: this.props.height / 2 + 1,
              }}>
                <div style={{
                  width: this.props.width / 2,
                  height: this.props.height / 2,
                  display: 'inline-block',
                  float: 'left',
                  borderBottom: '1px solid black',
                  borderRight: '1px solid black',
                }}>

                </div>
                <div style={{
                  width: this.props.width / 2,
                  height: this.props.height / 2,
                  display: 'inline-block',
                  float: 'left',
                  borderBottom: '1px solid black',
                  borderLeft: '1px solid black',
                }}>

                </div>
              </div>

              <div style={{
                width: this.props.width + 2,
                height: this.props.height / 2 + 1,
              }}>
                <div style={{
                  width: this.props.width / 2,
                  height: this.props.height / 2,
                  display: 'inline-block',
                  float: 'left',
                  borderTop: '1px solid black',
                  borderRight: '1px solid black',
                }}>

                </div>
                <div style={{
                  width: this.props.width / 2,
                  height: this.props.height / 2,
                  display: 'inline-block',
                  float: 'left',
                  borderTop: '1px solid black',
                  borderLeft: '1px solid black',
                }}>

                </div>
              </div>

            </div>
          )
        }
      }
    } else {  // -------------------------------------------------------------------------- 해당 셀을 클릭한 후
        if(this.state.turn % 2 == 1) {
          return (
            <div
              style={{
                width: this.props.width + 2,
                height: this.props.height + 2,
                backgroundColor: '#ffcc33',
              }}>
              <div
              style={{
                width: this.props.width + 2,
                height: this.props.height + 2,
                backgroundColor: '#ffcc33',
              }}>
                    <img src={whiteStone} style={{ width:this.props.width + 2, height:this.props.height + 2}} resizeMode="stretch" />  
                </div>
            </div>
          )
        } else {
          return (
            <div
              style={{
                width: this.props.width + 2,
                height: this.props.height + 2,
                backgroundColor: '#ffcc33',
              }}>
              <div
              style={{
                width: this.props.width + 2,
                height: this.props.height + 2,
                backgroundColor: '#ffcc33',
              }}>
                    <img src={blackStone} style={{ width:this.props.width + 2, height:this.props.height + 2}} resizeMode="stretch" />  
                </div>
            </div>
          )
        }
      
    }
  }


}
