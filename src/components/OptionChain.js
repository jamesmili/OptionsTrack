import React from "react";
import TableCell from '@material-ui/core/TableCell';
import Grid from '@material-ui/core/Grid';
import { AutoSizer, Column, Table, WindowScroller } from 'react-virtualized';
import 'react-virtualized/styles.css'
import { Link } from "gatsby";
import { connect } from 'react-redux';
import { contractInfo, order, orderBy } from '../state/app';
import TableSortLabel from '@material-ui/core/TableSortLabel';

class OptionChain extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            chain: props.chain
        }
        this.change = this.change.bind(this)
        this.changePercentage = this.changePercentage.bind(this)
        this.inTheMoney = this.inTheMoney.bind(this)
        this.headerRenderer = this.headerRenderer.bind(this)
        this.rowGetter = this.rowGetter.bind(this)
        this.cellRenderer = this.cellRenderer.bind(this)
        this.cellRendererFixed = this.cellRendererFixed.bind(this)
        this.impliedVolatility = this.impliedVolatility.bind(this)
        this.handleClickLink = this.handleClickLink.bind(this)
        this.descendingComparator = this.descendingComparator.bind(this)
        this.getComparator = this.getComparator.bind(this)
        this.createSortHandler = this.createSortHandler.bind(this)
        this.handleRequestSort = this.handleRequestSort.bind(this)
    }

    static getDerivedStateFromProps(nextProps, prevState){
        return{
            chain: nextProps.chain,
        }
    }

    headerRenderer(props){
        return(
            <TableCell
                component="div"
                variant="head"
                key={props.dataKey}
                className="tableFont"
                sortDirection={this.props.dataKey === props.dataKey ? this.props.ascDesc : false}>
                <TableSortLabel
                active={this.props.dataKey === props.dataKey}
                direction={this.props.dataKey === props.dataKey ? this.props.ascDesc : 'asc'}
                onClick={this.createSortHandler(props.dataKey)}
                >
                {props.label}
                </TableSortLabel>
            </TableCell>
        )
    }

    rowGetter({ index }){
        const table = this.state.chain.map((el, index) => [el, index]);
        table.sort((a, b) => {
          const order = this.getComparator(a[0], b[0]);
          if (order !== 0) return order;
          return a[1] - b[1];
        });
        return table.map((el) => el[0])[index];
    }
    change(props){
        const c = Number(props.cellData).toFixed(2)
        if (c < 0){
            return(
                <TableCell className="tableFont"><div className="negative">{c}</div></TableCell>
            )
        }else if (c > 0){
            return(
                <TableCell className="tableFont"><div className="positive">+{c}</div></TableCell>
            )
        }else{
            return(
                <TableCell className="tableFont">-</TableCell>
            )
        }
    }
    changePercentage(props){
        const c = Number(props.cellData).toFixed(2)
        if (c < 0){
            return(
                <TableCell className="tableFont"><div className="negative">{c}%</div></TableCell>
            )
        }else if (c > 0){
            return(
                <TableCell className="tableFont"><div className="positive">+{c}%</div></TableCell>
            )
        }else{
            return(
                <TableCell className="tableFont">-</TableCell>
            )
        }
    }
    handleClickLink(data){
        this.props.contractInfo(data)
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
                    <Link to={`/options/${this.props.currTicker}/${props.rowData.contractSymbol}`} onClick={this.handleClickLink(props.rowData)} >
                        <p className="strike tableFont">{Number(props.cellData).toFixed(2)}</p>
                    </Link>
                </Grid>
            </TableCell>
        )                
    }

    cellRenderer(props){
        return(
            <TableCell className="tableFont">{props.cellData}</TableCell>
        )
    }

    cellRendererFixed(props){
        return(
            <TableCell className="tableFont">{Number(props.cellData).toFixed(2)}</TableCell>
        )
    }

    impliedVolatility(props){
        return(
            <TableCell className="tableFont">{Number(props.cellData*100).toFixed(2)}%</TableCell>
        )
    }
    
    descendingComparator(a, b) {
        if (b[this.props.dataKey] < a[this.props.dataKey]) {
          return -1;
        }
        if (b[this.props.dataKey] > a[this.props.dataKey]) {
          return 1;
        }
        return 0;
      }

    getComparator(a,b) {
        return this.props.ascDesc === 'desc'
          ? this.descendingComparator(a, b)
          : -this.descendingComparator(a, b);
    }

    createSortHandler = (property) => (event) => {
        this.handleRequestSort(event, property);
    };
    handleRequestSort = (event, property) => {
        const isAsc = this.props.dataKey === property && this.props.ascDesc === 'asc';
        isAsc ? this.props.order('desc')  : this.props.order('asc') ;
        this.props.orderBy(property);
    };
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
                                label="O.I."
                                cellRenderer={this.cellRenderer}
                                headerRenderer={this.headerRenderer}
                                width={columnWidth}
                                minWidth={minWidth}
                            />
                            <Column 
                                key="impliedVolatility"
                                dataKey="impliedVolatility"
                                label="I.V."
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
        currTicker: state.app.currTicker,
        ascDesc: state.app.order,
        dataKey: state.app.orderBy
    }
}

const mapActionsToProps = dispatch => ({
    contractInfo: (c) => dispatch(contractInfo(c)),
    order: (o) => dispatch(order(o)),
    orderBy: (ob) => dispatch(orderBy(ob))
});

export default connect(mapStateToProps, mapActionsToProps) (OptionChain);