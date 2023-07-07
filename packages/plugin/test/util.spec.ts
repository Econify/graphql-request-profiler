import type { IOptionData, IGraphQLRequestData } from '../src/types';
import { requestGraphQL } from '../src/util';
import axios from 'axios';

jest.mock('axios', () => jest.fn());

const body = {
  query: Math.floor(Math.random() * 1000).toString(),
} as IGraphQLRequestData;

const options = {
  endpoint: Math.floor(Math.random() * 1000).toString(),
  headerName: 'x-header',
} as IOptionData;

describe('util', () => {
  describe('requestGraphQL', () => {
    it('calls API with correct options', async () => {
      await requestGraphQL(body, options);

      expect(axios).toHaveBeenCalledWith({
        method: 'POST',
        url: options.endpoint,
        data: body,
        headers: {
          [<string>options.headerName]: 'true',
        },
      });
    });

    it('bubbles errors', () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      axios.mockImplementationOnce(() => {
        throw new Error();
      });

      expect(() => requestGraphQL(body, options)).rejects.toThrow(Error);
    });
  });
});
