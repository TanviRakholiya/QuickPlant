import server from './src';
import cluster from 'cluster'
import os from 'os'
import { config } from './config';
import dotenv from 'dotenv';
dotenv.config();



// if (cluster.isMaster)
//     for (let i = 0; i < os.cpus().length; i++) cluster.fork()
// else {
//     const port = config.PORT || 80;
//     server.listen(port, () => {
//         console.log(`server started on port ${port}`);
//     });
// }


const port = config.PORT || 5000;
server.listen(port, () => { 
    console.log(`server started on port ${port}`);
}); 