import { createLogger, transports, format } from 'winston';
const { combine, timestamp, prettyPrint } = format;

const handleServerLog = createLogger({
    transports: [
        new transports.File({
            filename: 'logError.log',
            level: 'error',
            format: combine(timestamp(), prettyPrint()),
        }),
        new transports.File({
            filename: 'logInfo.log',
            level: 'info',
            format: combine(timestamp(), prettyPrint()),
        }),
    ],
});

export default handleServerLog;
