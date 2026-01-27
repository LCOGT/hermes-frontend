export function useCoordinateUtils() {

  function zPadFloat(num) {
    return num.toLocaleString(undefined, { minimumIntegerDigits: 2, maximumFractionDigits: 4 });
  }

  function decimalRaToSexigesimal(deg) {
    let rs = 1;
    let ra = deg;
    if (deg < 0) {
      rs = -1;
      ra = Math.abs(deg);
    }
    let raH = Math.floor(ra / 15);
    let raM = Math.floor((ra / 15 - raH) * 60);
    let raS = ((ra / 15 - raH) * 60 - raM) * 60;
    return {
      h: raH * rs,
      m: raM,
      s: raS,
      str: (rs > 0 ? '' : '-') + zPadFloat(raH) + ':' + zPadFloat(raM) + ':' + zPadFloat(raS)
    };
  }

  function decimalDecToSexigesimal(deg) {
    let ds = 1;
    let dec = deg;
    if (deg < 0) {
      ds = -1;
      dec = Math.abs(deg);
    }
    let decf = Math.floor(dec);
    let decM = Math.abs(Math.floor((dec - decf) * 60));
    let decS = (Math.abs((dec - decf) * 60) - decM) * 60;
    return {
      deg: decf * ds,
      m: decM,
      s: decS,
      str: (ds > 0 ? '' : '-') + zPadFloat(decf) + ':' + zPadFloat(decM) + ':' + zPadFloat(decS)
    };
  }

  function sexagesimalRaToDecimal(ra) {
    // algorithm: ra_decimal = 15 * ( hh + mm/60 + ss/(60 * 60) )
    /*                 (    hh     ):(     mm            ):  (   ss  ) */
    if (typeof ra === 'string') {
      let m = ra.match('^([0-9]?[0-9])[: ]([0-5]?[0-9][.0-9]*)[: ]?([.0-9]+)?$');
      if (m) {
        let hh = parseInt(m[1], 10);
        let mm = parseFloat(m[2]);
        let ss = m[3] ? parseFloat(m[3]) : 0.0;
        if (hh >= 0 && hh <= 23 && mm >= 0 && mm < 60 && ss >= 0 && ss < 60) {
          ra = (15.0 * (hh + mm / 60.0 + ss / 3600.0)).toFixed(10);
        }
      }
    }
    return ra;
  }

  function sexagesimalDecToDecimal(dec) {
    // algorithm: dec_decimal = sign * ( dd + mm/60 + ss/(60 * 60) )
    /*                  ( +/-   ) (    dd     ):(     mm            ): (   ss   ) */
    if (typeof dec === 'string') {
      let m = dec.match('^([+-])?([0-9]?[0-9])[: ]([0-5]?[0-9][.0-9]*)[: ]?([.0-9]+)?$');
      if (m) {
        let sign = m[1] === '-' ? -1 : 1;
        let dd = parseInt(m[2], 10);
        let mm = parseFloat(m[3]);
        let ss = m[4] ? parseFloat(m[4]) : 0.0;
        if (dd >= 0 && dd <= 90 && mm >= 0 && mm <= 59 && ss >= 0 && ss < 60) {
          dec = (sign * (dd + mm / 60.0 + ss / 3600.0)).toFixed(10);
        }
      }
    }
    return dec;
  }

  return { sexagesimalDecToDecimal, sexagesimalRaToDecimal, decimalRaToSexigesimal, decimalDecToSexigesimal };
}
