import React from "react";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Grid from '@material-ui/core/Grid';
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
            { id: 'strike', numeric: true, label: 'Strike' },
            { id: 'lastPrice', numeric: true, label: 'Last Price' },
            { id: 'bid', numeric: true, label: 'Bid' },
            { id: 'ask', numeric: true, label: 'Ask' },
            { id: 'delta', numeric: true, label: 'Delta'},
            { id: 'gamma', numeric: true, label: 'Gamma'},
            { id: 'theta', numeric: true, label: 'Theta'},
            { id: 'rho', numeric: true, label: 'Rho'},
            { id: 'vega', numeric: true, label: 'Vega'},
            { id: 'change', numeric: true, label: 'Change' },
            { id: 'percentChange', numeric: true, label: '%Change' },
            { id: 'volume', numeric: true, label: 'Volume' },
            { id: 'openInterest', numeric: true, label: 'Open Interest' },
            { id: 'impliedVolatility', numeric: true, label: 'Implied Volatility'}
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
            <div>
                <TableContainer id="table">
                    <Table>
                        <TableHead>
                            <TableRow>
                                { 
                                    headerCells.map((headCell) => {
                                        return(
                                        <TableCell
                                            key={headCell.id}
                                            sortDirection={this.state.orderBy === headCell.id ? this.state.order : false}
                                            style={{padding: cellSize, fontSize: fontSize}}>
                                            <TableSortLabel
                                            active={this.state.orderBy === headCell.id}
                                            direction={this.state.orderBy === headCell.id ? this.state.order : 'asc'}
                                            onClick={this.createSortHandler(headCell.id)}
                                            >
                                            {headCell.label}
                                            </TableSortLabel>
                                        </TableCell>
                                        )
                                    })
                                }
                            </TableRow>
                        </TableHead>
                        <TableBody>
                        {
                            this.tableSort(this.props.chain)
                            .map((row, index) => {
                                return (
                                    <TableRow key={row.contractSymbol}>
                                        {inTheMoney(row.strike, row.inTheMoney, row.contractSymbol)}
                                        <TableCell style={{padding: cellSize}}>{row.lastPrice}</TableCell>
                                        <TableCell style={{padding: cellSize}}>{row.bid}</TableCell>
                                        <TableCell style={{padding: cellSize}}>{row.ask}</TableCell>
                                        <TableCell style={{padding: cellSize}}>{row.delta}</TableCell>
                                        <TableCell style={{padding: cellSize}}>{row.gamma}</TableCell>
                                        <TableCell style={{padding: cellSize}}>{row.theta}</TableCell>
                                        <TableCell style={{padding: cellSize}}>{row.rho}</TableCell>
                                        <TableCell style={{padding: cellSize}}>{row.vega}</TableCell>
                                        {change(row.change)}  
                                        {changePercentage(row.percentChange)}                         
                                        <TableCell style={{padding: cellSize}}>{row.volume}</TableCell>
                                        <TableCell style={{padding: cellSize}}>{row.openInterest}</TableCell>
                                        <TableCell style={{padding: cellSize}}>{Number(row.impliedVolatility*100).toFixed(2)}%</TableCell>
                                    </TableRow>
                                )
                            })
                        }
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        )
    }
}

export default OptionChain