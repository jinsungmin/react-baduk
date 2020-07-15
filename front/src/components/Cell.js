import React, { Component } from 'react';

export default class Cell extends Component {
  constructor(props) {
    super(props);

    this.state = {
      clicked = false,
      turn = false,
    }
  }

  render() {
    if (this.props.y == 0) {
      if (this.props.x == 0) {  // 바둑판 왼쪽 위 끝
        return (
          <div style={{
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
          <div style={{
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
          <div style={{
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
          <div style={{
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
          <div style={{
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
          <div style={{
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
          <div style={{
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
          <div style={{
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
          <div style={{
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


  }

}
