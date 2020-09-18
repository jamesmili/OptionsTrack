import React from "react";
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Grid from '@material-ui/core/Grid';
import { AutoSizer, Column, Table } from 'react-virtualized';
import 'react-virtualized/styles.css'
import { Link } from "gatsby";

class OptionChain extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            order: 'asc',
            orderBy: 'strike',
        }
        this.descendingComparator = this.descendingComparator.bind(this)
        this.getComparator = this.getComparator.bind(this)
        this.tableSort = this.tableSort.bind(this)
        this.createSortHandler = this.createSortHandler.bind(this)
        this.handleRequestSort = this.handleRequestSort.bind(this)
    }

    descendingComparator(a, b) {
        if (b[this.state.orderBy] < a[this.state.orderBy]) {
          return -1;
        }
        if (b[this.state.orderBy] > a[this.state.orderBy]) {
          return 1;
        }
        return 0;
      }

    getComparator(a,b) {
        return this.state.order === 'desc'
          ? this.descendingComparator(a, b)
          : -this.descendingComparator(a, b);
    }

    tableSort(array) {
        const table = array.map((el, index) => [el, index]);
        table.sort((a, b) => {
          const order = this.getComparator(a[0], b[0]);
          if (order !== 0) return order;
          return a[1] - b[1];
        });
        return table.map((el) => el[0]);
    }

    createSortHandler = (property) => (event) => {
        this.handleRequestSort(event, property);
    };
    handleRequestSort = (event, property) => {
        const isAsc = this.state.orderBy === property && this.state.order === 'asc';
        isAsc ? this.setState({order: 'desc'}) : this.setState({order: 'asc'});
        this.setState({orderBy: property});
    };

    render(){
        const headerCells = [
            { dataKey: 'strike', label: 'Strike', width: 120 },
            { dataKey: 'lastPrice', label: 'Last Price', width: 120 },
            { dataKey: 'bid', label: 'Bid', width: 120 },
            { dataKey: 'ask', label: 'Ask', width: 120 },
            { dataKey: 'delta', label: 'Delta', width: 120 },
            { dataKey: 'gamma', label: 'Gamma', width: 120 },
            { dataKey: 'theta', label: 'Theta', width: 120 },
            { dataKey: 'rho', label: 'Rho', width: 120 },
            { dataKey: 'vega', label: 'Vega', width: 120 },
            { dataKey: 'change', label: 'Change', width: 120 },
            { dataKey: 'percentChange', label: '%Change', width: 120 },
            { dataKey: 'volume', label: 'Vol.', width: 120 },
            { dataKey: 'openInterest', label: 'Open Interest', width: 120 },
            { dataKey: 'impliedVolatility', label: 'Implied Volatility', width: 120 }
        ]
        const change = (chge) => {
            const c = Number(chge).toFixed(2)
            if (c < 0){
                return(
                    <TableCell style={{padding: cellSize}}><div className="negative">{Number(c).toFixed(2)}</div></TableCell>
                )
            }else if (c > 0){
                return(
                    <TableCell style={{padding: cellSize}}><div className="positive">+{Number(c).toFixed(2)}</div></TableCell>
                )
            }else{
                return(
                    <TableCell style={{padding: cellSize}}>-</TableCell>
                )
            }
        }
        const changePercentage = (chge) => {
            const c = Number(chge).toFixed(2)
            if (c < 0){
                return(
                    <TableCell style={{padding: cellSize}}><div className="negative">{Number(c).toFixed(2)}%</div></TableCell>
                )
            }else if (c > 0){
                return(
                    <TableCell style={{padding: cellSize}}><div className="positive">+{Number(c).toFixed(2)}%</div></TableCell>
                )
            }else{
                return(
                    <TableCell style={{padding: cellSize}}>-</TableCell>
                )
            }
        }
        const inTheMoney = (strike, itm, contract) => {
            return(
                <TableCell style={{paddingRight: cellSize}}>
                    <Grid container spacing={3}
                    direction="row"
                    justify="flex-start"
                    alignItems="stretch"
                    >
                        {
                            itm ? 
                            <div className="itm"></div>
                            :
                            <div className="otm"></div>

                        }
                        <Link to={`/options/${this.props.quote.symbol}/${contract}`} >
                            <p className="strike">{strike}</p>
                        </Link>
                    </Grid>
                </TableCell>
            )                
        }

        const cellSize = "7px"
        const fontSize = "12px"

        return(
            <AutoSizer>
                {({height, width}) => (
                    <Table
                    height={400}
                    width={width}
                    rowHeight={50}
                    gridStyle={{
                    direction: 'inherit',
                    }}
                    headerHeight={48}
                    rowCount={this.props.chain.length}
                    rowGetter={({ index }) => this.props.chain[index]}
                    >
                        {
                            headerCells.map(({ dataKey, ...other }, index) => {
                            return (
                                <Column
                                key={dataKey}
                                dataKey={dataKey}
                                {...other}
                                />
                            );
                        })}                
                    </Table>
                )}
            </AutoSizer>
        )
    }
}

export default OptionChain