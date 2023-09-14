import 'flatpickr/dist/themes/airbnb.css';
import { useState } from 'react';
import Flatpickr from 'react-flatpickr';
import { Spanish } from 'flatpickr/dist/l10n/es';
import { ParamsReport } from "../interfaces";
import { BeginEndResult, dateTimeFormat, getBeginEndFromInterval, Interval, timeFormat } from "../helpers/dateutils";
import { CustomDialog } from "./CustomDialog";
import { Input } from "./common/Input";
import { Button } from "./common/Button";

interface Props {
  id?: string;
  label?: string;
  isHistory?: boolean;
  getParams: (params: ParamsReport) => void;
}

export default function RangeDatepicker({ id, label, getParams }: Props) {
  const [dialog, setDialog] = useState(false);
  const [date, setDate] = useState<string[]>([]);
  const [params, setParams] = useState<BeginEndResult>();

  const openDialog = () => {
    setDialog(true);
  };

  const closeDialog = () => {
    setDialog(false);
  };

  const displayDates = () => {
    if (params) {
      const beginF = params.begin ? dateTimeFormat.format(params.begin) : null;
      const endF = params.end ? dateTimeFormat.format(params.end) : null;
      return `${beginF} - ${endF}`;
    }
    return '------------';

  };

  const setDateInPicker = ({ begin, end }: BeginEndResult) => {
    setDate([begin.toISOString(), end.toISOString()]);
  };

  const setPeriod = (period: Interval) => {
    const paramsData = getBeginEndFromInterval(new Date(), period);
    setParams(paramsData);
    setDateInPicker(paramsData);
    const paramsReport = {
      begin: paramsData.begin.toISOString(),
      end: paramsData.end.toISOString(),
    };
    getParams(paramsReport);
    closeDialog();
  };

  const handleChange = ([begin, end]: Date[]) => {
    if (begin && end) {
      end.setHours(23, 59, 59);
      setParams({ ...params, begin, end });
    }
  };

  const displayDate = (date: Date | undefined) => {
    return date ? dateTimeFormat.format(date) : null;
  };

  const getTime = (date: Date | undefined) => {
    return date ? timeFormat.format(date) : '';
  };

  const setTime = (val: string, date: Date | undefined, key: string) => {
    if (!date) return;
    const newDate = new Date(date);
    const hours = Number(val.slice(0, 2));
    const min = Number(val.slice(3, 5));
    newDate.setHours(hours, min);
    if (params) {
      setParams({ ...params, [key]: newDate });
    }
  };

  const emitParmas = () => {
    if (params) {
      const paramsReport = {
        begin: params.begin.toISOString(),
        end: params.end.toISOString(),
      };
      getParams(paramsReport);
      setDate([params.begin.toISOString(), params.end.toISOString()]);
    }
    closeDialog();
  };

  return (
    <section className="w-full flex flex-col gap-1">
      {label && (
        <label htmlFor={id}>
          {label}
        </label>
      )}

      <button
        id={id}
        className="p-2 border rounded-sm outline-none hover:bg-gray-200"
        title="Rango de fecha"
        onClick={openDialog}
      >
        <div className='flex gap-1 justify-start items-center'>
          <i className='lar la-lg la-calendar-minus' />
          <p className="text-xs font-normal text-gray-800">{displayDates()}</p>
        </div>
      </button>

      {/* dialog */}
      <CustomDialog dialog={dialog} closeDialog={closeDialog}>
        <div className='flex flex-col gap-4'>
          <div className='flex justify-between gap-2'>
            <div className='flex-1'>
              <Button type='button' color='secondary' size='xs' onClick={() => setPeriod(Interval.Month)}>
                Mes
              </Button>
            </div>
            <div className='flex-1'>
              <Button type='button' color='secondary' size='xs' onClick={() => setPeriod(Interval.Week)}>
                Semana
              </Button>
            </div>
            <div className='flex-1'>
              <Button type='button' color='secondary' size='xs' onClick={() => setPeriod(Interval.Day)}>
                Hoy
              </Button>
            </div>
            <div className='flex-initial'>
              <Button type='button' color='danger' onClick={closeDialog} size='xs'>
                <i className='las la-lg la-times' />
              </Button>
            </div>
          </div>
          <div className='flex-1'>
            <Flatpickr
              hidden
              value={date}
              options={{
                locale: Spanish,
                inline: true,
                mode: 'range',
                dateFormat: 'd/m/y',
              }}
              onChange={handleChange}
            />
          </div>
          <div className='flex gap-2'>
            <div className='flex-1 text-center'>
              <p className="text-xs text-gray-900 font-medium">{displayDate(params?.begin)}</p>
              <Input
                type='time'
                onChange={(e) => setTime(e.target.value, params?.begin, 'begin')}
                value={getTime(params?.begin)}
              />
            </div>
            <div className='flex-1 text-center'>
              <p className="text-xs text-gray-900 font-medium">{displayDate(params?.end)}</p>
              <Input
                type='time'
                onChange={(e) => setTime(e.target.value, params?.end, 'end')}
                value={getTime(params?.end)}
              />
            </div>
          </div>
          <Button type='button' color='primary' onClick={emitParmas}>
            Generar
          </Button>
        </div>
      </CustomDialog>
    </section>
  );
}