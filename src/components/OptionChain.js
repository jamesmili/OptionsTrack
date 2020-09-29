import React from "react";
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Grid from '@material-ui/core/Grid';
import { AutoSizer, Column, Table, WindowScroller} from 'react-virtualized';
import Paper from '@material-ui/core/Paper';
import 'react-virtualized/styles.css'
import { Link } from "gatsby";

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
                    <Link to={`/options/${this.props.quote.symbol}/${props.rowData.contractSymbol}`} >
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
        return(
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
                                width={80}
                            />
                            <Column 
                                key="lastPrice"
                                dataKey="lastPrice"
                                label="Last Price"
                                cellRenderer={this.cellRendererFixed}
                                headerRenderer={this.headerRenderer}
                                width={80}
                            />
                            <Column 
                                key="bid"
                                dataKey="bid"
                                label="Bid"
                                cellRenderer={this.cellRendererFixed}
                                headerRenderer={this.headerRenderer}
                                width={80}
                            />
                            <Column 
                                key="ask"
                                dataKey="ask"
                                label="Ask"
                                cellRenderer={this.cellRendererFixed}
                                headerRenderer={this.headerRenderer}
                                width={80}
                            />
                            <Column 
                                key="delta"
                                dataKey="delta"
                                label="Delta"
                                cellRenderer={this.cellRenderer}
                                headerRenderer={this.headerRenderer}
                                width={90}
                            />
                            <Column 
                                key="gamma"
                                dataKey="gamma"
                                label="Gamma"
                                cellRenderer={this.cellRenderer}
                                headerRenderer={this.headerRenderer}
                                width={90}
                            />
                            <Column 
                                key="theta"
                                dataKey="theta"
                                label="Theta"
                                cellRenderer={this.cellRenderer}
                                headerRenderer={this.headerRenderer}
                                width={90}
                            />
                            <Column 
                                key="rho"
                                dataKey="rho"
                                label="Rho"
                                cellRenderer={this.cellRenderer}
                                headerRenderer={this.headerRenderer}
                                width={90}
                            />
                            <Column 
                                key="vega"
                                dataKey="vega"
                                label="Vega"
                                cellRenderer={this.cellRenderer}
                                headerRenderer={this.headerRenderer}
                                width={90}
                            />
                            <Column
                                key="change"
                                dataKey="change"
                                label="Change"
                                cellRenderer={this.change}
                                headerRenderer={this.headerRenderer}
                                width={80}
                            />
                            <Column
                                key="percentChange"
                                dataKey="percentChange"
                                label="%Change"
                                cellRenderer={this.change}
                                headerRenderer={this.headerRenderer}
                                width={80}
                            />
                            <Column 
                                key="volume"
                                dataKey="volume"
                                label="Volume"
                                cellRenderer={this.cellRenderer}
                                headerRenderer={this.headerRenderer}
                                width={80}
                            />
                            <Column 
                                key="openInterest"
                                dataKey="openInterest"
                                label="Open Interest"
                                cellRenderer={this.cellRenderer}
                                headerRenderer={this.headerRenderer}
                                width={80}
                            />
                            <Column 
                                key="impliedVolatility"
                                dataKey="impliedVolatility"
                                label="Implied Volatility"
                                cellRenderer={this.impliedVolatility}
                                headerRenderer={this.headerRenderer}
                                width={80}
                            />
                        </Table>    
                        )}
                    </AutoSizer>
                )}
            </WindowScroller>
        )
    }
}

export default OptionChain