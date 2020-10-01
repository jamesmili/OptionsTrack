import React from "react";
import TableCell from '@material-ui/core/TableCell';
import Grid from '@material-ui/core/Grid';
import { AutoSizer, Column, Table, WindowScroller} from 'react-virtualized';
import 'react-virtualized/styles.css'
import { Link } from "gatsby";
import { connect } from 'react-redux';

class OptionChain extends React.Component{
    constructor(props){
        super(props)
        this.change = this.change.bind(this)
        this.changePercentage = this.changePercentage.bind(this)
        this.inTheMoney = this.inTheMoney.bind(this)
        this.headerRenderer = this.headerRenderer.bind(this)
        this.rowGetter = this.rowGetter.bind(this)
        this.cellRenderer = this.cellRenderer.bind(this)
        this.cellRendererFixed = this.cellRendererFixed.bind(this)
        this.impliedVolatility = this.impliedVolatility.bind(this)
    }

    headerRenderer(props){
        return(
            <TableCell
                component="div"
                variant="head"
                key={props.dataKey}
            >
                <span>{props.label}</span>
            </TableCell>
        )
    }

    rowGetter({ index }){
        return this.props.chain[index]
    }
    change(props){
        const c = Number(props.cellData).toFixed(2)
        if (c < 0){
            return(
                <TableCell><div className="negative">{Number(c).toFixed(2)}</div></TableCell>
            )
        }else if (c > 0){
            return(
                <TableCell><div className="positive">+{Number(c).toFixed(2)}</div></TableCell>
            )
        }else{
            return(
                <TableCell>-</TableCell>
            )
        }
    }
    changePercentage(props){
        const c = Number(props.cellData).toFixed(2)
        if (c < 0){
            return(
                <TableCell><div className="negative">{Number(c).toFixed(2)}%</div></TableCell>
            )
        }else if (c > 0){
            return(
                <TableCell><div className="positive">+{Number(c).toFixed(2)}%</div></TableCell>
            )
        }else{
            return(
                <TableCell>-</TableCell>
            )
        }
    }
    inTheMoney(props){
        return(
            <TableCell >
                <Grid container spacing={3}
                direction="row"
                justify="flex-start"
                alignItems="stretch"
                >
                    {
                        props.rowData.inTheMoney ? 
                        <div className="itm"></div>
                        :
                        <div className="otm"></div>

                    }
                    <Link to={`/options/${this.props.currTicker}/${props.rowData.contractSymbol}`} >
                        <p className="strike">{Number(props.cellData).toFixed(2)}</p>
                    </Link>
                </Grid>
            </TableCell>
        )                
    }

    cellRenderer(props){
        return(
            <TableCell>{props.cellData}</TableCell>
        )
    }

    cellRendererFixed(props){
        return(
            <TableCell>{Number(props.cellData).toFixed(2)}</TableCell>
        )
    }

    impliedVolatility(props){
        return(
            <TableCell>{Number(props.cellData*100).toFixed(2)}%</TableCell>
        )
    }
    
    render(){
        const columnWidth = 100
        const changeColumn = 120
        const greekColumn = 95
        const minWidth = 70
        return(
            <div id="table">
            <WindowScroller>
                {({height, isScrolling, scrollTop}) => (
                <AutoSizer >
                    {({width}) => (
                        <Table
                        autoHeight={true}
                        isScrolling={isScrolling}
                        scrollTop={scrollTop}                        
                        width={width}
                        height={height}
                        rowHeight={50}
                        headerHeight={48}
                        rowGetter={this.rowGetter}
                        rowCount={this.props.chain.length}
                        deferredMeasurementCache={this.props.cache}
                        >
                            <Column 
                                key="strike"
                                dataKey="strike"
                                label="Strike"
                                cellRenderer={this.inTheMoney}
                                headerRenderer={this.headerRenderer}
                                width={columnWidth}
                                minWidth={minWidth}
                            />
                            <Column 
                                key="lastPrice"
                                dataKey="lastPrice"
                                label="Last Price"
                                cellRenderer={this.cellRendererFixed}
                                headerRenderer={this.headerRenderer}
                                width={columnWidth}
                                minWidth={minWidth}
                            />
                            <Column 
                                key="bid"
                                dataKey="bid"
                                label="Bid"
                                cellRenderer={this.cellRendererFixed}
                                headerRenderer={this.headerRenderer}
                                width={columnWidth}
                                minWidth={minWidth}
                            />
                            <Column 
                                key="ask"
                                dataKey="ask"
                                label="Ask"
                                cellRenderer={this.cellRendererFixed}
                                headerRenderer={this.headerRenderer}
                                width={columnWidth}
                                minWidth={minWidth}
                            />
                            <Column 
                                key="delta"
                                dataKey="delta"
                                label="Delta"
                                cellRenderer={this.cellRenderer}
                                headerRenderer={this.headerRenderer}
                                width={greekColumn}
                                minWidth={minWidth}
                            />
                            <Column 
                                key="gamma"
                                dataKey="gamma"
                                label="Gamma"
                                cellRenderer={this.cellRenderer}
                                headerRenderer={this.headerRenderer}
                                width={greekColumn}
                                minWidth={minWidth}
                            />
                            <Column 
                                key="theta"
                                dataKey="theta"
                                label="Theta"
                                cellRenderer={this.cellRenderer}
                                headerRenderer={this.headerRenderer}
                                width={greekColumn}
                                minWidth={minWidth}
                            />
                            <Column 
                                key="rho"
                                dataKey="rho"
                                label="Rho"
                                cellRenderer={this.cellRenderer}
                                headerRenderer={this.headerRenderer}
                                width={greekColumn}
                                minWidth={minWidth}
                            />
                            <Column 
                                key="vega"
                                dataKey="vega"
                                label="Vega"
                                cellRenderer={this.cellRenderer}
                                headerRenderer={this.headerRenderer}
                                width={greekColumn}
                                minWidth={minWidth}
                            />
                            <Column
                                key="change"
                                dataKey="change"
                                label="Change"
                                cellRenderer={this.change}
                                headerRenderer={this.headerRenderer}
                                width={changeColumn}
                                minWidth={minWidth}
                            />
                            <Column
                                key="percentChange"
                                dataKey="percentChange"
                                label="%Change"
                                cellRenderer={this.change}
                                headerRenderer={this.headerRenderer}
                                width={changeColumn}
                                minWidth={minWidth}
                            />
                            <Column 
                                key="volume"
                                dataKey="volume"
                                label="Vol."
                                cellRenderer={this.cellRenderer}
                                headerRenderer={this.headerRenderer}
                                width={columnWidth}
                                minWidth={minWidth}
                            />
                            <Column 
                                key="openInterest"
                                dataKey="openInterest"
                                label="Open Int."
                                cellRenderer={this.cellRenderer}
                                headerRenderer={this.headerRenderer}
                                width={columnWidth}
                                minWidth={minWidth}
                            />
                            <Column 
                                key="impliedVolatility"
                                dataKey="impliedVolatility"
                                label="Imp Vol."
                                cellRenderer={this.impliedVolatility}
                                headerRenderer={this.headerRenderer}
                                width={changeColumn}
                                minWidth={minWidth}
                            />
                        </Table>    
                        )}
                    </AutoSizer>
                )}
            </WindowScroller>
            </div>
        )
    }
}

const mapStateToProps = (state, props) => {
    return {
        currTicker: state.app.currTicker
    }
}

export default connect(mapStateToProps) (OptionChain);